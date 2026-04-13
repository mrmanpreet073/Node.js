import type { userPayload } from "../app/auth/utils/token.ts"

declare global {
    namespace Express {
        interface Request {
            user?: userPayload  // ✅ reuse same type — no duplication
        }
    }
}

export {}



//            Why Create It?
//            Express's Request type is defined by @types/express and it does not have a user property by default:
//            typescript// what @types/express gives you
//            interface Request {
//                body: any
//                params: any
//                headers: any
//                query: any
//                // ... no user ❌
//            }
//            So when you do req.user TypeScript errors:
//            typescriptreq.user = decodedValues  
//            // ❌ Property 'user' does not exist on type 'Request'
           
//            What .d.ts Does
//            It merges your custom properties into Express's existing Request interface:
//            typescript// @types/express Request  +  your express.d.ts
//            //         ↓                        ↓
//            interface Request {            interface Request {
//                body: any                      user?: UserPayload
//                params: any           +    }
//                headers: any
//            }
//            //              ↓ TypeScript merges into
//            interface Request {
//                body: any
//                params: any
//                headers: any
//                user?: UserPayload  // ✅ now exists
//            }
           
//            Why Separate .d.ts File?
//            typescript// ✅ .d.ts file — ONLY types, no runtime code
//            // - zero impact on compiled JS output
//            // - keeps type declarations organized
//            // - auto picked up by TypeScript
           
//            // ❌ declaring inside a .ts file works but
//            // - mixes types with runtime code
//            // - harder to maintain