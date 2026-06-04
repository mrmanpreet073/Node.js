import http from 'http';
import path from 'path';

import express from 'express';
import { Server } from 'socket.io'

const checkBoxCount = 100 ;


const state = {
     checkBoxes : new Array(checkBoxCount).fill(false)
}


async function main() {
    const app = express()
    const server = http.createServer(app);
    const PORT = process.env.PORT ?? 5000;


    // SOCKET IO
    const io = new Server();
    io.attach(server);

    io.on('connection',(socket)=>{
        console.log('Socket Connected B:',{id:socket.id});
        
        socket.on('Client:Checkbox:Change',(data)=>{
            console.log(`Client ${socket.id} changed checkbox`,data);
            io.emit("server:Checkbox:change",data)  
            state.checkBoxes[data.index] = data.checked  
        })
    })


    // Express
    app.use(express.static(path.resolve('./public')));
    app.get('/health', (req, res) => {
        res.json({ Health: 'Good' })
    })
    app.get('/checkboxes',(req,res) => {

        res.json({
        checkboxes: state.checkBoxes
    });
        
    })

    server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);

    })
}
main()