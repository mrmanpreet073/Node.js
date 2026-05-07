import express from "express";
import multer from "multer";
import fs from "fs";

const app = express();

//  SAVING THE BUFFER INTO UPLOADS FILE 
// ======================================

// Memory storage
const storage = multer.memoryStorage();

const upload = multer({ storage });

// Upload route
app.post(
    "/upload",

    upload.single("image"),

    (req, res) => {

        // Generate unique filename
        const fileName =
            Date.now() + "-" + req.file.originalname;

        // Save buffer into uploads folder
        fs.writeFileSync(
            "uploads/" + fileName,
            req.file.buffer
        );

        res.json({
            message: "File saved",
            fileName
        });

    }
);


app.listen(3000, () => {
    console.log("Server started");
});