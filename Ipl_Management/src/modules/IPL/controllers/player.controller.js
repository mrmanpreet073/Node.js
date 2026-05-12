import apiResponse from '../../../common/utils/apiResponse.js';
import * as playerService from '../services/player.service.js'


const createPlayer = async (req, res, next) => {

    try {
        const player = await playerService.createPlayer( req.body);
        apiResponse.created(res, "Player Created Successfully",player)
    } catch (error) {
        next(error)
    }
}
const updatePLayerRole = async (req, res, next) => {

    try {
        const player = await playerService.updatePlayerRole(req.params.id, req.body);
        apiResponse.ok(res, "Player Updated Successfully",player)
    } catch (error) {
        next(error)
    }
}
const getPlayers = async (req, res, next) => {

    try {
        const player = await playerService.getPlayers();
        apiResponse.ok(res, "Player Fetched Successfully",player)
    } catch (error) {
        next(error)
    }
}
const transferPlayer = async (req, res, next) => {

    try {
        const player = await playerService.transferPlayer(req.params.id, req.body);
        apiResponse.ok(res, "Player Transfer Successfully",player)
    } catch (error) {
        next(error)
    }
}
const deletePlayer = async (req, res, next) => {

    try {

        const player = await playerService.deletePlayer(req.params.id);
        apiResponse.ok(res, "Player Deleted Successfully",player)
        
    } catch (error) {

        next(error)

    }
}

export {createPlayer,updatePLayerRole,getPlayers,deletePlayer,transferPlayer}