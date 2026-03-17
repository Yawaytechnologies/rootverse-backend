import path from "path";
import crypto from "crypto";

export function buildProfileKey({ userId,  originalName }) {
  const ext = originalName?.split(".").pop() || "jpg";
  return `profiles/${userId}/profile_${Date.now()}.${ext}`;
}

export function buildFishTypeKey({ originalName }) {
  const ext = originalName?.split(".").pop() || "jpg";
  return `fish_types/image_${Date.now()}.${ext}`;
}

export const generateKey = (folder, originalname) => {
  const ext = path.extname(originalname).toLowerCase();
  const unique = `${Date.now()}-${crypto.randomUUID()}`;
  return `${folder}/${unique}${ext}`;
};
