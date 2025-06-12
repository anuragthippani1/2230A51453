require("dotenv").config();
const authService = require("../services/authService");

async function setup() {
  try {
    console.log("Starting setup process...");

    // Validate environment variables
    const requiredEnvVars = [
      "EMAIL",
      "NAME",
      "MOBILE_NO",
      "GITHUB_USERNAME",
      "ROLL_NO",
      "COLLEGE_NAME",
      "ACCESS_CODE",
    ];

    const missingVars = requiredEnvVars.filter(
      (varName) => !process.env[varName]
    );
    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(", ")}`
      );
    }

    // Log registration data (without sensitive info)
    console.log("\nRegistration data:");
    console.log("Email:", process.env.EMAIL);
    console.log("Name:", process.env.NAME);
    console.log("Roll No:", process.env.ROLL_NO);
    console.log("College:", process.env.COLLEGE_NAME);
    console.log("GitHub:", process.env.GITHUB_USERNAME);
    console.log("Mobile:", process.env.MOBILE_NO);

    // Register with the evaluation service
    console.log("\nRegistering with the evaluation service...");
    const registrationResult = await authService.register();
    console.log("Registration successful!");
    console.log("Client ID:", registrationResult.clientId);

    // Get authentication token
    console.log("\nGetting authentication token...");
    const token = await authService.getAuthToken();
    console.log("Authentication successful!");
    console.log("Token:", token);

    console.log("\nSetup completed successfully!");
  } catch (error) {
    console.error("\nSetup failed:", error.message);
    if (error.response?.data) {
      console.error("Server response:", error.response.data);
    }
    process.exit(1);
  }
}

setup();
