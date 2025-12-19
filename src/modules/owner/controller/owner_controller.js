import OwnerService from '../service/owner_service.js';

const OwnerController = {
    async createOwner(req, res) {
        try {
            const owner = await OwnerService.createOwner(req.body);
            res.status(201).json({success: true, data: owner});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

export default OwnerController;
