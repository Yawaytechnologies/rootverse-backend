export function buildProfileKey({ userId,  originalName }) {
  const ext = originalName?.split(".").pop() || "jpg";
  return `profiles/${userId}/profile_${Date.now()}.${ext}`;
}

export function buildFishTypeKey({ originalName }) {
  const ext = originalName?.split(".").pop() || "jpg";
  return `fish_types/image_${Date.now()}.${ext}`;
}

export const generateKey = (prefix) => {
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}/file_${Date.now()}_${random}`;
};
