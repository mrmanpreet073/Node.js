import Redis from 'ioRedis'




export const publisher = new Redis({
    host: 'localhost',
    port: 6379,
})

export const subscriber = new Redis({
    host: 'localhost',
    port: 6379,
})

export const redis  = new Redis({
    host: 'localhost',
    port: 6379,
})