import apiError from "../../../common/utils/apiError.js";
import Owner from "../models/owner.model.js";

const createOwner = async ({ name, company }) => {

    return await Owner.create({
        name,
        company
    });
};

const getAllOwner = async () => {

    return await Owner.find();
};

const getOwnerById = async (id) => {

    const owner = await Owner.findById(id);

    if (!owner) {
        throw apiError.NotFound("Owner not found");
    }

    return owner;
};

const updateOwner = async (id, { name, company }) => {

    const updatedOwner = await Owner.findByIdAndUpdate(
        id,
        { name, company },
        {
            new: true,
            runValidators: true
        }
    );

    if (!updatedOwner) {
        throw apiError.NotFound("Owner not found with this id");
    }

    return updatedOwner;
};

const deleteOwner = async (id) => {

    const owner = await Owner.findByIdAndDelete(id);

    if (!owner) {
        throw apiError.NotFound("Owner not found with this id");
    }

    return owner;
};

export {
    createOwner,
    getAllOwner,
    getOwnerById,
    updateOwner,
    deleteOwner
};