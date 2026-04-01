import mongoose from 'mongoose'


async function connection(url){
    mongoose.connect(url)
}

export default connection;