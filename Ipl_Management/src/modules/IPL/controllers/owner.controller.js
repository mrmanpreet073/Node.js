import apiError from '../../../common/utils/apiError'
import apiResponse from '../../../common/utils/apiResponse';
import * as ownerService from '../services/owner.servie.js'


const createOwner = async (req,res) => {

    const owner = await ownerService.createOwner(req.body);
    apiResponse.created(res,"Owner Created Successful",owner)

}