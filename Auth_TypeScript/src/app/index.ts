import express from 'express'


 function createApplication(){

    const app = express()

    app.get('/',(req,res)  => {
        return res.json({message:"welcome"});
    })
    return app
 }

 export {createApplication}