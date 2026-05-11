// create ownner 
// get all owner 
// get owner by id 
// update owner
//  delete owner

import apiError from "../../../../../imageKit/src/common/utils/apiError.js"
import apiResponse from "../../../../../imageKit/src/common/utils/api.js"
import Owner from "../models/owner.model"



const createOwner = async ({ name, company }) => {

    try {
        const owner = await Owner.create({ name, company });
        return owner;
    } catch (error) {
        throw apiError.internal(error.message);
    }
};

const getAllOwner = async () => {

    try {
        const owners = await Owner.find();
        return owners
    } catch (error) {
        throw apiError.internal(error.message);
    }

}

const getOwnerById = async ({id}) => {

    try {
        const owner = Owner.findById(id)
        apiResponse.ok()
    } catch (error) {
        
    }
    
}

export { createOwner, getAllOwner, getOwnerById }