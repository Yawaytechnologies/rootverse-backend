export const ok = (res, data, message = "Success", statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta: { server_time_utc: new Date().toISOString() },
  });
};

export const created = (res, data, message = "Created") =>
  ok(res, data, message, 201);

export const fail = (res, message, statusCode = 400, errors = null) => {
  const body = {
    success: false,
    message,
    meta: { server_time_utc: new Date().toISOString() },
  };
  if (errors) body.errors = errors;
  return res.status(statusCode).json(body);
};
