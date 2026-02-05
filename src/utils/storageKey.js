export function buildProfileKey({ userId,  originalName }) {
  const ext = originalName?.split(".").pop() || "jpg";
  return `profiles/${userId}/profile_${Date.now()}.${ext}`;
}

export function buildFishTypeKey({ originalName }) {
  const ext = originalName?.split(".").pop() || "jpg";
  return `fish_types/image_${Date.now()}.${ext}`;
}
