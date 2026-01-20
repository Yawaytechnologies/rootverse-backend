import { createQualityChecker, getAllQualityCheckers, getQualityCheckerByCode, updateQualityCheckerById, deleteQualityCheckerById } from "./quality.model.js";

export async function createQualityCheckerService(payload) {
    try {
        const [qualityChecker] = await createQualityChecker(payload);
        return qualityChecker;
    } catch (error) {
        console.error("Error in createQualityCheckerService:", error);
        throw new Error("Failed to create quality checker");
    }
}

export async function getAllQualityCheckersService() {
    try {
        const qualityCheckers = await getAllQualityCheckers();
        return qualityCheckers;
    } catch (error) {
        console.error("Error in getAllQualityCheckersService:", error);
        throw new Error("Failed to retrieve quality checkers");
    }
}

export async function getQualityCheckerByCodeService(checker_code) {
    try {
        const qualityChecker = await getQualityCheckerByCode(checker_code);
        return qualityChecker;
    } catch (error) {
        console.error("Error in getQualityCheckerByCodeService:", error);
        throw new Error("Failed to retrieve quality checker by code");
    }
}

export async function updateQualityCheckerByIdService(id, updates) {
    try {
        const [qualityChecker] = await updateQualityCheckerById(id, updates);
        return qualityChecker;
    } catch (error) {
        console.error("Error in updateQualityCheckerByIdService:", error);
        throw new Error("Failed to update quality checker");
    }
}

export async function deleteQualityCheckerByIdService(id) {
    try {
        const result = await deleteQualityCheckerById(id);
        return result;
    } catch (error) {
        console.error("Error in deleteQualityCheckerByIdService:", error);
        throw new Error("Failed to delete quality checker");
    }
}
