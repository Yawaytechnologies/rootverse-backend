import db from "../../config/db.js";

export const getUserByIdService = async (userId) => {
  const user = await db("rootverse_users")
    .select("*")
    .where({ owner_id: userId })
    .first();

  if (user) return user;

  const qualityChecker = await db("quality_checker")
    .select("*")
    .where({ checker_code: userId })
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
