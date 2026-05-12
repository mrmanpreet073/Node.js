import apiError from "../../../common/utils/apiError.js";
import Team from "../models/team.model.js";





const createTeam = async ({ name, ownerId }) => {

    try {
        const team = await Team.create({ name,ownerId});
        if (!team) {
            throw apiError.badRequest("team Not Created")
        }
        return team

    } catch (error) {
        throw error
    }

}

export {createTeam}