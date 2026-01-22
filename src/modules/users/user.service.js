import db from "../../config/db.js";

export const getUserByIdService = async (userId) => {
  const user = await db("rootverse_users")
    .select("id", "phone_no", "rootverse_type", "verification_status", "username")
    .where({ id: userId })
    .first();

  if (user) return user;

  const qualityChecker = await db("quality_checkers")
    .select("id", "checker_phone", "rootverse_type", "checker_name")
    .where({ id: userId })
    .first();

  if (qualityChecker) return qualityChecker;

  return null;
};

export const deleteUserByIdService = async (userId) => {
  await db("rootverse_users").where({ id: userId }).del();
  await db("quality_checkers").where({ id: userId }).del();
};

export const updateUserByIdService = async (userId, updateData) => {
  await db("rootverse_users").where({ id: userId }).update(updateData);
};
