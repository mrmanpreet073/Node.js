import { nanoid } from 'nanoid'
import URL from '../models/url.js';

async function generateShortUlr(req, res) {

    const body = req.body;
    if (!body) return res.status(400).json({ error: "url required" })

    const shortId = nanoid(8);

    await URL.create({
        shortId: shortId,
        redirectUrl: body.url,
        visitHistory: []
    })
    return res.render('home', {
        id: shortId
    })
    // return res.json({ id: shortId })

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
export { generateShortUlr, getAnalasys ,updateandredirect};