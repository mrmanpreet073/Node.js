import http from 'http'
import { env } from './env.js'
import { log } from 'console'




async function main() {
 try  { const server = http.createServer()
    const PORT = env.PORT ? +env.PORT : 8000

    server.listen(PORT, () => {
     console.log(`Server is running on PORT ${PORT}`)
    })
}catch(error)
{
throw error;    
}

}

main()