import mongoose from 'mongoose'
import express from 'express'

const app = express();
const port = 8000;

app.use(express.json());   // IMPORTANT
app.use(express.urlencoded({ extended: false }));

// CONNECTION
mongoose.connect('mongodb://127.0.0.1:27017/employee')
.then(()=>console.log('Connection Successful'))
.catch((e)=>console.log('Error',e))

// SCHEMA
const studentSchema = new mongoose.Schema({
 firstName:{
    type:String,
    required:true
 },
 lastName:String,
 email:{
    type:String,
    required:true,
    unique:true
 },
 jobTitle:String,
 gender:String
});

const User = mongoose.model('user',studentSchema);

app.get('/', (req, res) => {
  res.send('Hello World!');
  console.log('dsds');
  
});

app.post('/user', async (req, res) => {
   const result = await User.create({
      firstName:req.body.firstName,
      lastName:req.body.lastName,
      email:req.body.email,
      gender:req.body.gender,
      jobTitle:req.body.jobTitle
   });

   res.status(201).json(result);
   console.log('result = ', result);
   
});

app.get('/users', async (req, res) => {
   const result = await User.find({firstName:"manpreet"});
   res.status(200).json(result);
});

app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});