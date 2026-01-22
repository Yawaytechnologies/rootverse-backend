import db from "../../config/db.js";

export const getUserByIdService = async (userId) => {
  const user = await db("rootverse_users")
    .select("*")
    .where({ id: userId })
    .first();
    return user;
};

export const deleteUserByIdService = async (userId) => {
  await db("rootverse_users")
    .where({ id: userId })
    .del();
}

export const updateUserByIdService = async (userId, updateData) => {
  await db("rootverse_users")
    .where({ id: userId })
    .update(updateData);
}
