import mongoose from 'mongoose'

const sponserSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true,"Sponser name is required"],
        trim:true,
        minlength:2,
        maxlength:100
    }
},{timestamps:true});

sponserSchema.index({name:1 } , {unique:true});

export default mongoose.model("Sponser", sponserSchema);