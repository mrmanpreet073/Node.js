import { nanoid } from 'nanoid'
import URL from '../models/url.js';

async function generateShortUlr(req, res) {

    const { url } = req.body;
    const urls = await URL.find({})
    
    if (!url) {
        return res.status(400).json({ error: "URL required" });
    }

    //  if url already exists
    const existingUrl = await URL.findOne({ redirectUrl: url });

    if (existingUrl) {
        return res.render("home", {
            id: existingUrl.shortId,
            allUrls: urls
        });
    }

    const shortId = nanoid(8);

    await URL.create({
        shortId: shortId,
        redirectUrl: url,
        visitHistory: []
    });

    // 4. Fetch the updated list after creation

    return res.render("home", {
        id: shortId,
        allUrls: urls // Pass the updated list
    });
}

async function getAnalasys(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });
    if (result) {
        return res.json({
            totalClicks: result.visitHistory.length,
            Analytics: result.visitHistory
        })
    }
    else {
        console.log('error in analysis');

    }

}

async function updateandredirect(req, res) {

    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({ shortId }, {
        $push: {
            visitHistory: { timeStamp: Date.now() }
        }
    })
    res.redirect(entry.redirectUrl)
}
export { generateShortUlr, getAnalasys, updateandredirect };