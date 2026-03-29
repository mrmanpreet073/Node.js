import { nanoid } from 'nanoid'
import URL from '../models/url.js';

async function generateShortUlr(req, res) {

    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: "URL required" });
    }

    // check if url already exists for this user
    const existingUrl = await URL.findOne({
        redirectUrl: url,
        createdBy: req.user._id
    });

    if (existingUrl) {

        const urls = await URL.find({ createdBy: req.user._id });

        return res.render("home", {
            id: existingUrl.shortId,
            allUrls: urls
        });
    }

    const shortId = nanoid(8);

    await URL.create({
        shortId,
        redirectUrl: url,
        visitHistory: [],
        createdBy: req.user._id
    });

    const urls = await URL.find({ createdBy: req.user._id });

    return res.render("home", {
        id: shortId,
        allUrls: urls
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