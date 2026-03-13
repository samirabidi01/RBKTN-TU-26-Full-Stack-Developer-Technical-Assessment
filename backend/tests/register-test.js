export function generateUserData(context, events, done) {
  const random = Math.floor(Math.random() * 1000000000);
  const now = Date.now();

  context.vars.name = `user_${random}`;
  context.vars.email = `user_${random}_${now}@test.com`;
  context.vars.password = "123456";

  return done();
}

export function metricsByEndpoint_beforeRequest(requestParams, context, ee, next) {
  return next();
}

export function metricsByEndpoint_afterResponse(requestParams, response, context, ee, next) {
  return next();
}