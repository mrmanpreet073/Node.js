import apiError from "../../../common/utils/apiError.js";
import Player from "../models/player.model.js"


const createPlayer = async ({ name, role,teamId }) => {

    try {
        const player = await Player.create({  name, role,teamId });
        if (!player) {
            throw apiError.badRequest("player Not Created")
        }
        return player

    } catch (error) {
        throw error
    }

}


const getPlayers = async () => {
    try {
        const players = await Player.find()

        if (!players) {
            throw apiError.NotFound(`Players not Found `)
        }

        return player

    } catch (error) {
        throw error
    }
}


const updatePlayerRole = async (id, { role }) => {
    try {
        const player = await Player.findByIdAndUpdate(id,
            { role },
            { new: true, runValidators: true }
        )

        if (!player) {
            throw apiError.NotFound(`Player not Found with This Id=> ${id} `)
        }

        return player

    } catch (error) {
        throw error
    }
}

const transferPlayer = async (id, {teamId}) => {
    try {
        const player = await Player.findByIdAndUpdate(id,
            { teamId },
            { new: true, runValidators: true }
        )

        if (!player) {
            throw apiError.NotFound(`Player not Found with This Id=> ${id} `)
        }

        return player

    } catch (error) {
        throw error
    }
}

const deletePlayer = async (id) => {
    try {
        const player = await Player.findByIdAndDelete(id)

        if (!player) {
            throw apiError.NotFound(`Player not Found with This Id=> ${id} `)
        }

        return player

    } catch (error) {
        throw error
    }
}


export { createPlayer, updatePlayerRole, getPlayers, transferPlayer ,deletePlayer}