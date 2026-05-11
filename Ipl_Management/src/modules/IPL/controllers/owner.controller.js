import apiError from '../../../common/utils/apiError.js'
import apiResponse from '../../../common/utils/apiResponse.js';
import * as ownerService from '../services/owner.service.js'

const createOwner = async (req, res, next) => {

    try {
        const owner = await ownerService.createOwner(req.body);
        apiResponse.created(res, "Owner Created Successfully", owner)
    } catch (error) {
        next(error)
    }

}
const getOwners = async (req, res, next) => {

    try {
        const owners = await ownerService.getAllOwner();
        apiResponse.ok(res, "Owners fetched Successfully", owners)
    } catch (error) {
        next(error)
    }

}

const getOwnerById = async (req, res, next) => {
    try {
        const owner = await ownerService.getOwnerById(req.params.id)
        apiResponse.ok(res, "Owners Found Successfully", owner)
    } catch (error) {
        next(error);
    }

}

const updateOwner = async (req, res, next) => {
    try {
        const owner = await ownerService.updateOwner(req.params.id, req.body);
        apiResponse.ok(res, "Owners Updated Successfully", owner)
    } catch (error) {
        next(error);
    }

}

const deleteOwner = async (req, res, next) => {
    try {
        const owner = await ownerService.deleteOwner(req.params.id);
        apiResponse.ok(res, "Owners Deleted Successfully", owner)

    } catch (error) {
        next(error)
    }
}

export {createOwner,deleteOwner,updateOwner,getOwnerById,getOwners}