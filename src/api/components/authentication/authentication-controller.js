const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');
const loginAttempts = {};
function resetLoginAttempts(email) {
  if (loginAttempts[email]) {
    const { lastAttempt } = loginAttempts[email];
    const thirtyMinutesInMillis = 30 * 60 * 1000;
    if (Date.now() - lastAttempt >= thirtyMinutesInMillis) {
      delete loginAttempts[email];
    }
  }
}
/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    resetLoginAttempts(email);
    if (loginAttempts[email] && loginAttempts[email].count >= 6) {
      throw errorResponder(
        errorTypes.FORBIDDEN,
        'Too many failed login attempts. Please try again later.'
      );
    }

    if (!loginAttempts[email]) {
      loginAttempts[email] = { count: 1, lastAttempt: Date.now() };
    } else {
      loginAttempts[email].count += 1;
      loginAttempts[email].lastAttempt = Date.now();
    }

    if (loginAttempts[email].count >= 5) {
      throw errorResponder(
        errorTypes.FORBIDDEN,
        'Too many failed login attempts. Please try again later.'
      );
    }

    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong email or password'
      );
    }
    delete loginAttempts[email];
    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
