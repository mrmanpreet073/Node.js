
import apiResponse from '../../../common/utils/apiResponse.js';
import * as teamService from '../services/team.service.js'


const createTeam = async (req, res, next) => {

    try {
        const team = await teamService.createTeam(req.body);
        apiResponse.created(res, "Player Created Successfully",team)
    } catch (error) {
        next(error)
    }
}

export {createTeam}