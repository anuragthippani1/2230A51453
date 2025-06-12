const axios = require("axios");

class AuthService {
  constructor() {
    this.baseURL = "http://20.244.56.144/evaluation-service";
    this.token = null;
  }

  async register() {
    try {
      const registrationData = {
        email: process.env.EMAIL,
        name: process.env.NAME,
        mobileNo: process.env.MOBILE_NO,
        githubUsername: process.env.GITHUB_USERNAME,
        rollNo: process.env.ROLL_NO,
        collegeName: process.env.COLLEGE_NAME,
        accessCode: process.env.ACCESS_CODE,
      };

      // Validate registration data
      Object.entries(registrationData).forEach(([key, value]) => {
        if (!value) {
          throw new Error(`Missing required field: ${key}`);
        }
      });

      console.log(
        "Sending registration request to:",
        `${this.baseURL}/register`
      );
      const response = await axios.post(
        `${this.baseURL}/register`,
        registrationData
      );

      if (!response.data?.clientId || !response.data?.clientSecret) {
        throw new Error("Invalid registration response: missing credentials");
      }

      // Store the credentials in environment variables
      process.env.CLIENT_ID = response.data.clientId;
      process.env.CLIENT_SECRET = response.data.clientSecret;

      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw new Error(
          `Registration failed: ${JSON.stringify(error.response.data)}`
        );
      }
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  async getAuthToken() {
    try {
      if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
        throw new Error("Missing client credentials. Please register first.");
      }

      const authData = {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
      };

      console.log("Sending authentication request to:", `${this.baseURL}/auth`);
      const response = await axios.post(`${this.baseURL}/auth`, authData);

      if (!response.data?.token) {
        throw new Error("Invalid authentication response: missing token");
      }

      this.token = response.data.token;
      return this.token;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Invalid client credentials");
      }
      if (error.response?.data) {
        throw new Error(
          `Authentication failed: ${JSON.stringify(error.response.data)}`
        );
      }
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  getToken() {
    return this.token;
  }
}

module.exports = new AuthService();
