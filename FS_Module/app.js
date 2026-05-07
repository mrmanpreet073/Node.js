// Import Express framework
import express from "express";

// Import Multer middleware for file uploads
import multer from "multer";


// Create Express application
const app = express();


// Configure storage settings for multer
const storage = multer.diskStorage({

    // destination -> decides where uploaded files will be stored
    destination: (req, file, cb) => {

        // cb(error, folderPath)
        // null means no error
        cb(null, 'uploads/');
    },

    // filename -> decides saved filename
    filename: (req, file, cb) => {

        // Date.now() adds unique timestamp
        // file.originalname gives original uploaded filename

        cb(null, Date.now() + '-' + file.originalname);
    }
});


// Create multer middleware using storage configuration
const upload = multer({ storage });


// POST route for uploading file
app.post( "/upload", upload.single("image"), // upload.single("image") // Accept only ONE file // "image" must match input field name

    // Controller function
    (req, res) => {

        // Uploaded file data becomes available in req.file
        console.log(req.file);

        // Send response
        res.json({
            message: "Uploaded",
            // Send uploaded file information
            file: req.file
        });
    }
);

app.get("/", (req, res) => {
    res.send("Server running");
});

app.listen(3000, () => {

    console.log("Server started");

});


//   fieldname: 'image',
//   originalname: 'Screenshot 2026-03-21 235205.png',
//   encoding: '7bit',
//   mimetype: 'image/png',
//   destination: 'uploads/',
//   filename: '1778173184961-Screenshot 2026-03-21 235205.png',
//   path: 'uploads\\1778173184961-Screenshot 2026-03-21 235205.png',
//   size: 1285101