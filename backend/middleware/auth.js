const authService = require("../services/authService");

const authenticate = async (req, res, next) => {
  try {
    const token = authService.getToken();
    if (!token) {
      // Try to get a new token
      await authService.getAuthToken();
    }
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: "Not authenticated. Please get an auth token first.",
    });
  }
};

module.exports = authenticate;
