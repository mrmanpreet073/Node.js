import mongoose from 'mongoose'

const urlSchema = mongoose.Schema({
    shortId:{
        type:"string",
        required:true,
        unique:true
    },
    redirectUrl:{
       type:"string",
        required:true,
         
    },
    visitHistory:{
        type:[{timeStamp:{type:Number}}]
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    }
},{timeStamps:true});

const URL  = mongoose.model('url',urlSchema)

export default URL;