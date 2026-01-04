export function buildProfileKey({ userId,  originalName }) {
  const ext = originalName?.split(".").pop() || "jpg";
  return `profiles/${userId}/profile_${Date.now()}.${ext}`;
}