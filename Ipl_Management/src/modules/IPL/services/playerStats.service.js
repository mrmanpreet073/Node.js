import Player from "../models/player.model.js"
import apiError from '../../../common/utils/apiError.js'
import PlayerStats from "../models/playerStats.model.js"


const createPlayerState = async ({
    playerId,
    matches,
    runs,
    wickets,
    average,
    strikeRate
}) => {

    const player = await Player.findById( playerId )

    if (!player) {
        throw apiError.NotFound("Player Not Found")
    }

    const playerStats = await PlayerStats.findById(playerId)

    if (playerStats) {
        throw apiError.conflict("Player Stats Already Exists")
    }

    const addPlayer = await PlayerStats.create({
        playerId,
        matches,
        runs,
        wickets,
        average,
        strikeRate
    })

}

const getAllPlayerStats = async () => {

    return await PlayerStats.find()
        .populate("playerId","name role");
};

const getHighestRunScorer = async () => {

    const player = await PlayerStats.findOne()
        .sort({ runs: -1 })
        .populate("playerId", "name role");

    if (!player) {
        throw apiError.NotFound(
            "No player stats found"
        );
    }

    return player;
};

const getHighestWicketTaker = async () => {
    const player = await PlayerStats.findOne()
        .sort({ wickets: -1 })
        .populate("playerId", "name role")

    if (!player) {
        throw apiError.NotFound("No player stats found")
    }
    return player;
}

export { createPlayerState, getAllPlayerStats, getHighestRunScorer ,getHighestWicketTaker}