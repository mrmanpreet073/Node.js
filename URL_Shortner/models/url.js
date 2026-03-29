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
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    }
}, { timestamps: true })

//model 

const URL = mongoose.model('url',UrlSchema)


export default  URL ;

