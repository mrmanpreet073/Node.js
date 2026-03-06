const express = require('express');
const users = require('./data.json')
const fs = require('fs')
const app = express()
const port = 8000;


// MiddleWare
app.use(express.urlencoded({ extended: false }))


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
// Grouped routes using app.route()
app.route('/api/users/:id')

    // GET single user
    .get((req, res) => {
        const id = Number(req.params.id)
        const user = users.find((user) => user.id === id)
        return res.json(user);

    }).patch((req, res) => {
        return res.json({ status: "pending" })

    }).delete((req, res) => {
        return res.json({ status: "pending" })
    }).put((req, res) => {
        return res.json({ status: "pending" })
    })

app.post("/api/users", (req, res) => {
                 
            //  Data Sent From the client 
            //   ^
    const body = req.body;
    console.log('body->', body);
    users.push({ ...body, id: users.length + 1 });
    fs.writeFile("./data.json", JSON.stringify(users), (err, data) => {

    })

    return res.json({ status: "Success" , id: users.length})
})


app.listen(port, () => console.log('server started '))
