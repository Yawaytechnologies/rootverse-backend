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
    const { name, phone, address, email, date_of_birth, location_id, status } = data;
    const updatedCratePacker = await repository.updateCratePacker(id, {
        name: name || cratePacker.name,
        phone: phone || cratePacker.phone,
        address: address || cratePacker.address,
        email: email || cratePacker.email,
        date_of_birth: date_of_birth || cratePacker.date_of_birth,
        location_id: location_id || cratePacker.location_id,
        status: status || cratePacker.status,
    });
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