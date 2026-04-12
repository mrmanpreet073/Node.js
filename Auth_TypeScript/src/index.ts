import { log } from 'node:console';
import {createServer} from 'node:http';
import { createApplication } from './app/index.js';


async function main(){
    try {

        const server = createServer(createApplication());//handler (I want express to handle my routes)
        const PORT = 6000
        
        server.listen(PORT,() => {
            console.log(`Server is listning at Port ${PORT}`);
        })
    } catch (err) {
        console.log('error starting server');
        throw err
    }
}

main()