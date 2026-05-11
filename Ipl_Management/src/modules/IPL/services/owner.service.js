

//  delete owner

import apiError from "../../../common/utils/apiError.js";
import apiResponse from "../../../common/utils/apiResponse.js";
import Owner from "../models/owner.model.js"

const createOwner = async ({ name, company }) => {

    try {
        const owner = await Owner.create({ name, company });
        return owner;
    } catch (error) {
        throw error;
    }
};

const getAllOwner = async () => {

    try {
        const owners = await Owner.find();
        return owners
    } catch (error) {
        throw error;
    }

}

const getOwnerById = async ( id ) => {

    try {
        const owner = await Owner.findById(id)
        if (!owner) {

            throw apiError.NotFound("Owner not found")
        }
        return owner

    } catch (error) {
      throw error
    }

}

const updateOwner = async (id, { name, company }) => {
    try {
        const updatedOwner = await Owner.findByIdAndUpdate(id,
            { name, company, },
            { new: true }
        )


        if (!updatedOwner) {
            throw apiError.NotFound("owner not found with this id")
        }

        return updatedOwner;

    } catch (error) {
        throw error
    }
}
const deleteOwner = async (id) => {
    try {
        const owner = await Owner.findByIdAndDelete(id)

        if (!owner) {
            throw apiError.NotFound("owner not found with this id")
        }

        return owner

    } catch (error) {
        throw error
    }
}

export { createOwner, getAllOwner, getOwnerById, updateOwner, deleteOwner }