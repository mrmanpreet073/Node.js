import * as tsServices from '../services/teamSponsor.service.js'
import apiResponse from '../../../common/utils/apiResponse.js'


const attachSponser = async (req, res, next) => {

    try {
        const ts = await tsServices.attachSponser(req.body)
        return apiResponse.created(res, "sponser Attach", ts)
    } catch (error) {
        next(error)
    }

}
const getTs = async (req, res, next) => {

    try {
        const tss = await tsServices.getTs()
        return apiResponse.ok(res, "sponser Attach", tss)
    } catch (error) {
        next(error)
    }

}

export {attachSponser,getTs}