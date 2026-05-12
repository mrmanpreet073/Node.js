import apiError from "../../../common/utils/apiError.js";
import Player from "../models/player.model.js"
import Team from "../models/team.model.js";


const createPlayer = async ({ name, role, teamId }) => {

    const team = await Team.findById(teamId)

    if (!team) {
        throw apiError.NotFound("Team not found")
    }

    return await Player.create({
        name,
        role,
        teamId
    })
}

const getPlayers = async () => {

    const players = await Player.find()
        .populate("teamId")

    return players
}

const updatePlayerRole = async (id, { role }) => {

    const player = await Player.findByIdAndUpdate(
        id,
        { role },
        {
            new: true,
            runValidators: true
        }
    )

    if (!player) {
        throw apiError.NotFound("Player not found")
    }

    return player
}

const transferPlayer = async (id, { teamId }) => {

    const team = await Team.findById(teamId)

    if (!team) {
        throw apiError.NotFound("Team not found")
    }

    const player = await Player.findByIdAndUpdate(
        id,
        { teamId },
        {
            new: true,
            runValidators: true
        }
    )
    if (!player) {
        throw apiError.NotFound("Player not found")
    }

    return player
}

const deletePlayer = async (id) => {

    const player = await Player.findByIdAndDelete(id)

    if (!player) {
        throw apiError.NotFound(
            `Player not found with this id => ${id}`
        )
    }

    return player
}


export { createPlayer, updatePlayerRole, getPlayers, transferPlayer, deletePlayer }