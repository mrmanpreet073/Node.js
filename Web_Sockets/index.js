import http from 'http';
import path from 'path';

import express from 'express';
import { Server } from 'socket.io'

import { publisher, subscriber, redis } from './redis_connection.js'

const checkBoxCount = 100;
const checkBox_Key = "checkboxe";
const rateLimitingHashMap = new Map();

async function main() {
    const app = express()
    const server = http.createServer(app);
    const PORT = process.env.PORT ?? 5000;


    // SOCKET IO
    const io = new Server();
    io.attach(server);

    await subscriber.subscribe('internal-server:checkbox-change');
    subscriber.on('message', (channel, message) => {

        if (channel === 'internal-server:checkbox-change') {
            const { index, checked } = JSON.parse(message);
            io.emit('server:Checkbox:change', { index, checked })
        }
    })

    io.on('connection', (socket) => {
        console.log('Socket Connected B:', { id: socket.id });

        socket.on('Client:Checkbox:Change', async (data) => {
            console.log(`Client ${socket.id} changed checkbox`, data);

            // RATE LIMITING
            const lastOperationTime = rateLimitingHashMap.get(socket.id)
            if (lastOperationTime) {
                const timeElapsed = Date.now() - lastOperationTime
                if (timeElapsed < 5.5 * 1000) {
                    socket.emit("server:error", { error: "Please wait few second to check" })
                }
            }

            rateLimitingHashMap.set(socket.id, Date.now())

            const existing_state = await redis.get(checkBox_Key);

            if (existing_state) {
                const remoteData = JSON.parse(existing_state);
                remoteData[data.index] = data.checked;
                await redis.set(checkBox_Key, JSON.stringify(remoteData))
            } else {
                const newState = new Array(checkBoxCount).fill(false);
                newState[data.index] = data.checked;
                await redis.set(checkBox_Key, JSON.stringify(newState))
            }


            publisher.publish('internal-server:checkbox-change', JSON.stringify(data))
        })
    })


    // Express
    app.use(express.static(path.resolve('./public')));

    app.get('/health', (req, res) => {
        res.json({ Health: 'Good' })
    })

    app.get('/checkboxes', async (req, res) => {

        const existing_state = await redis.get(checkBox_Key);
        if (existing_state) {
            const remoteData = JSON.parse(existing_state);
            res.json({ checkboxes: remoteData });
        } else {
            res.json({ checkboxes: new Array(checkBoxCount).fill(false) });
        }
    })

    server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);

    })
}
main()