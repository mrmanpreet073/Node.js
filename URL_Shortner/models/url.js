import mongoose from 'mongoose'


//SCHEMA
let UrlSchema = new mongoose.Schema({
    shortId: {
        type: String,
        unique: true,
        required: true
    },
    redirectUrl: {
        type: String,
        required: true
    },
    visitHistory: {
        type: [{ timeStamp: { type: Number } }]
    },
}, { timestamps: true })

//model 

const URL = mongoose.model('url',UrlSchema)


export default  URL ;

