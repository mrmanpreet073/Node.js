import mongoose from 'mongoose'

async function connection (url){
    return mongoose.connect(url)
}
export default connection