import apiError from '../../../common/utils/apiError.js'
import Sponsor from '../models/sponser.model.js'
import Team from '../models/team.model.js'
import TeamSponsor from '../models/teamSponsor.model.js'

const attachSponser = async ({ teamId, sponsorId }) => {

    const team = await Team.findById(teamId)
    if (!team) {
        throw apiError.NotFound("Team not found")
    }

    const sponsor = await Sponsor.findById(sponsorId)
    if (!sponsor) {
        throw apiError.NotFound("Team not found")
    }

    const teamSponsor = await TeamSponsor.findOne({ teamId, sponsorId })
    if (teamSponsor) {
        throw apiError.conflict("Sponsor already attached to this team")
    }

    const ts = await TeamSponsor.create({ teamId, sponsorId })
    return ts
}

const getTs = async () => {
    const tss = await TeamSponsor.find();

    if (!tss) {
        throw apiError.NotFound("TeamSponser not found")

    }
}

export { attachSponser,getTs }