import { nanoid } from "nanoid";
import URL from "../models/url.model.js";
import { timeStamp } from "console";


async function generateUrl(req, res) {
    const { url } = req.body;

    // 1. Validation check with early return
    if (!url) {
        return res.status(400).json({ error: "Please enter a URL" });
    }

    // 2. Checking if THIS specific user already shortened this link
    const existingUrl = await URL.findOne({
        redirectUrl: url,
        createdBy: req.user._id 
    });

    if (existingUrl) {
        // Fetch current user's list only
        const allUrls = await URL.find({ createdBy: req.user._id });
        return res.render('home', {
            id: existingUrl.shortId,
            allUrls: allUrls
        });
    }

    // 3. Create the new short ID
    const shortId = nanoid(8);

    await URL.create({
        shortId: shortId,
        redirectUrl: url,
        visitHistory: [],
        createdBy: req.user._id
    });

    // 4. Fetch the updated list AFTER creation
    const allUrls = await URL.find({ createdBy: req.user._id });

    return res.render('home', {
        id: shortId,
        allUrls: allUrls // Now contains the new URL!
    });
}

async function redirectUrl(req, res) {

    const shortId = req.params.shortId;

    const entery = await URL.findOneAndUpdate(
        { shortId },
        {
            $push: {
                visitHistory: { timeStamp: Date.now() }
            }
        }
    );

    if (!entery) {
        return res.status(404).send("Short URL not found");
    }

    console.log(entery.redirectUrl);

    res.redirect(entery.redirectUrl);
}

async function getAnalysis(req, res) {
    const shortId = req.params.shortId;
    const entry = await URL.findOne({ shortId });

    if (!entry) {
        return res.status(404).send("Short URL not found");
    }

    return res.render("analysis", {
        totalClicks: entry.visitHistory?.length || 0,
        analytics: entry.visitHistory || []
    });
}

async function deleteUrl(req, res) {
const shortId = req.params.shortId;
    
    try {
        await URL.findOneAndDelete({ shortId: shortId });
        res.redirect('/'); 
    } catch (error) {
        console.error("Error deleting URL:", error);
        res.status(500).send("Internal Server Error");
    }    

}

export { generateUrl, redirectUrl, getAnalysis ,deleteUrl}