export async function loginOrCreateUser(mobileNumber) {
  let user = await knex("users")
    .where({ mobile_number: mobileNumber })
    .first();

  if (!user) {
    [user] = await knex("users")
      .insert({ mobile_number: mobileNumber })
      .returning("*");
  }

  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = generateRefreshToken();

  await knex("refresh_tokens").insert({
    user_id: user.id,
    token: refreshToken,
    expires_at: knex.raw("NOW() + INTERVAL '30 days'"),
  });

  return { accessToken, refreshToken, user };
}
