import apiResponse from '../../../common/utils/apiResponse.js'

import * as playerStatsService from '../services/playerStats.service.js'

const createPlayerStats = async (req, res, next) => {
    try {
        const playerStats =await playerStatsService.createPlayerState(req.body)
        apiResponse.created(res, "Player Stats Created", playerStats)
    } catch (error) {
        next(error)
    }
}

const getAllPlayerStats = async (req, res, next) => {
    try {
        const player = await playerStatsService.getAllPlayerStats()
        apiResponse.ok(res, "Player Fetched Successfully", player)
    } catch (error) {
        next(error)
    }
}

const getHighestRunScorer = async (req, res, next) => {
    try {
        const player = await playerStatsService.getHighestRunScorer()
        apiResponse.ok(res, "Player Fetched Successfully", player)
    } catch (error) {
        next(error)
    }
}
const getHighestWicketTaker = async (req, res, next) => {
    try {
        const player = await playerStatsService.getHighestWicketTaker()
        apiResponse.ok(res, "Player Fetched Successfully", player)
    } catch (error) {
        next(error)
    }
}


export {createPlayerStats,getHighestRunScorer,getAllPlayerStats,getHighestWicketTaker}