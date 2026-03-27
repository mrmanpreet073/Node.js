import mongoose from 'mongoose'
import express from 'express'

const app = express();
const port = 8000;

app.use(express.json());   // IMPORTANT
app.use(express.urlencoded({ extended: false }));

// CONNECTION
mongoose.connect('mongodb://127.0.0.1:27017/employee')
   .then(() => console.log('Connection Successful'))
   .catch((e) => console.log('Error', e))

// SCHEMA
const studentSchema = new mongoose.Schema({
   firstName: {
      type: String,
      required: true
   },
   lastName: String,
   email: {
      type: String,
      required: true,
      unique: true
   },
   jobTitle: String,
   gender: String
});

const User = mongoose.model('user', studentSchema);


// Get Users from database
app.get('/', async (req, res) => {
   const result = await User.find({});
   const html =
      `<ul>
         ${result.map((item) => (
         ` <li> name : ${item.firstName}  email: ${item.email}</li>`

      )).join("")}
      </ul>`
   res.send(html);
});
app.get('/users', async (req, res) => {
   const result = await User.find();
   res.status(200).json(result);
});

// Add user in Database
app.post('/user', async (req, res) => {
   const result = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      gender: req.body.gender,
      jobTitle: req.body.jobTitle
   });

   res.status(201).json(result);
   console.log('result = ', result);

});

// Grouped routes
app.route('/user/:id')
   .get(async (req, res) => { // FIND BY ID
      const user = await User.findById(req.params.id);
      if (user) {
         return res.json(user)
      } else {
         return res.status(404).json({ error: "error he ji " })
      }
   }) //UPDATE BY ID
   .patch(async (req, res) => {
      const user = await User.findByIdAndUpdate(req.params.id, { lastName: "jatt" }
      )
      res.json("sucess")
   })  // DELETE BY ID
   .delete(async (req, res) => {
      const user = await User.findByIdAndDelete(req.params.id)
      res.json("deleted")
   })

app.listen(port, () => {
   console.log(`Express server listening at http://localhost:${port}`);
});