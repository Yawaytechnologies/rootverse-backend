import * as repository from "./repository.js";
export const createCratePacker = async (data) => {
    const { name, phone, address, email, date_of_birth, location_id } = data;
    if (!name || !phone || !address || !email || !date_of_birth) {
        throw new Error("Missing required fields");
    }
    const cratePacker = await repository.createCratePacker({
        name,
        phone,
        address,
        email,
        date_of_birth,
        location_id,
        status: "active",
    });
    return cratePacker;
};

export const getCratePackerById = async (id) => {
    return await repository.getCratePackerById(id);
};

export const updateCratePacker = async (id, data) => {
    const cratePacker = await repository.getCratePackerById(id);
    if (!cratePacker) {
        throw new Error("Crate packer not found");
    }
    const updatedCratePacker = await repository.updateCratePacker(id, data);
    return updatedCratePacker;
};
   

export const deleteCratePacker = async (id) => {
    const cratePacker = await repository.getCratePackerById(id);
    if (!cratePacker) {
        throw new Error("Crate packer not found");
    }
    await repository.deleteCratePacker(id);
    return true;
};

export const listCratePackers = async () => {
    return await repository.listCratePackers();
};