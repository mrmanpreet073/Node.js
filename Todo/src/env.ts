import {z} from 'zod'

const envSchema= z.object({
    PORT:z.string().optional()
})
//                               .-> NodeJS.ProcessEnv is a TypeScript type 
//                               |   provided by the Node type definitions (@types/node) for Node.js.
function createEnv(env: NodeJS.ProcessEnv){
    //                  -----------------
    const safeParse = envSchema.safeParse(env)
    if(!safeParse.success){
        throw new Error(safeParse.error.message)
    }
    else{
        return safeParse.data
    }
}
export const env = createEnv(process.env)
//                           ------------
//                                 ||
//                                 \/
// exposes the OS environment variables to your program.