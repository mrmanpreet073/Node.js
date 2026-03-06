const express = require('express');
const users = require('./data.json')
const app = express()
const port = 8000;

// Get All Users 
app.get("/api/users", (req, res) =>
    res.json(users));


// Get All user for browsers
// Sending get request for browser 
app.get('/users', (req, res) => {
    res.send(`
        ${users.map((user) => (
        `  <ul>
            <li>ID:${user.id}</li>>
            <li>First Name:${user.first_name}</li>>
            <li>Last Name:${user.last_name}</li>>
            <li>Email:${user.email}</li>>
            <li>Gender:${user.gender}</li>>
            <li>Job Title:${user.job_title}</li>
        </ul>
        
       `
    ))}
   
  `);

});

// Dynamic path parameter  
app.get('/api/users/:id',(req,res)=>{
    const id = Number(req.params.id)
    const user = users.find((user)=> user.id === id)
    return res.json(user);
})


app.listen(port, () => console.log('server started '))
