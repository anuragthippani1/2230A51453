// question1/services/stockService.js

const axios = require("axios");
const authService = require("./authService");

/**
 * StockService class for handling stock-related operations
 * Communicates with external stock API and provides methods for data analysis
 */
class StockService {
  constructor() {
    this.baseURL = "http://20.244.56.144/evaluation-service";
  }

  /**
   * Fetches historical stock prices for a given ticker
   * @param {string} ticker - Stock ticker symbol
   * @param {number} minutes - Number of minutes of historical data to fetch
   * @returns {Promise<Array<{price: number, timestamp: string}>>} Array of price objects
   * @throws {Error} If API request fails or response is invalid
   */
  async getStockHistory(ticker, minutes) {
    if (!ticker || typeof ticker !== "string") {
      throw new Error("Invalid ticker symbol");
    }

    if (!minutes || isNaN(minutes) || minutes <= 0) {
      throw new Error("Invalid minutes parameter");
    }

    const token = authService.getToken();
    if (!token) {
      throw new Error("Not authenticated. Please get an auth token first.");
    }

    try {
      const response = await axios.get(
        `${this.baseURL}/stocks/${ticker}/history`,
        {
          params: { minutes },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!Array.isArray(response.data)) {
        throw new Error("Invalid API response: expected array of price data");
      }

      // Validate each price object
      response.data.forEach((item, index) => {
        if (!item.price || !item.timestamp) {
          throw new Error(
            `Invalid price data at index ${index}: missing price or timestamp`
          );
        }
      });

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error(
          "Authentication token expired. Please get a new token."
        );
      }
      throw new Error(
        `Failed to fetch stock history for ${ticker}: ${error.message}`
      );
    }
  }

  /**
   * Gets all available stocks
   * @returns {Promise<Array<string>>} Array of stock tickers
   */
  async getAllStocks() {
    const token = authService.getToken();
    if (!token) {
      throw new Error("Not authenticated. Please get an auth token first.");
    }

    try {
      const response = await axios.get(`${this.baseURL}/stocks`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!Array.isArray(response.data)) {
        throw new Error(
          "Invalid API response: expected array of stock tickers"
        );
      }

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error(
          "Authentication token expired. Please get a new token."
        );
      }
      throw new Error(`Failed to fetch available stocks: ${error.message}`);
    }
  }

  /**
   * Calculates average price from an array of price objects
   * @param {Array<{price: number, timestamp: string}>} prices - Array of price objects
   * @returns {number} Average price
   */
  calculateAverage(prices) {
    if (!Array.isArray(prices)) {
      throw new Error("Input must be an array of price objects");
    }

    if (prices.length === 0) {
      return 0;
    }

    const sum = prices.reduce((acc, item) => {
      if (typeof item.price !== "number") {
        throw new Error("Invalid price value in input array");
      }
      return acc + item.price;
    }, 0);

    return sum / prices.length;
  }

  /**
   * Calculates standard deviation from an array of price objects
   * @param {Array<{price: number, timestamp: string}>} prices - Array of price objects
   * @returns {number} Standard deviation
   */
  calculateStandardDeviation(prices) {
    if (!Array.isArray(prices) || prices.length === 0) {
      return 0;
    }

    const mean = this.calculateAverage(prices);
    const squareDiffs = prices.map((price) => {
      const diff = price.price - mean;
      return diff * diff;
    });
    const avgSquareDiff =
      squareDiffs.reduce((sum, val) => sum + val, 0) / prices.length;
    return Math.sqrt(avgSquareDiff);
  }

  /**
   * Calculates Pearson correlation coefficient between two price arrays
   * @param {Array<{price: number, timestamp: string}>} prices1 - First array of price objects
   * @param {Array<{price: number, timestamp: string}>} prices2 - Second array of price objects
   * @returns {number} Correlation coefficient (-1 to 1)
   * @throws {Error} If input arrays are invalid
   */
  calculateCorrelation(prices1, prices2) {
    if (!Array.isArray(prices1) || !Array.isArray(prices2)) {
      throw new Error("Both inputs must be arrays of price objects");
    }

    if (prices1.length !== prices2.length) {
      throw new Error("Price arrays must be of equal length");
    }

    if (prices1.length === 0) {
      throw new Error("Price arrays cannot be empty");
    }

    const n = prices1.length;
    const x = prices1.map((p) => {
      if (typeof p.price !== "number") {
        throw new Error("Invalid price value in first array");
      }
      return p.price;
    });
    const y = prices2.map((p) => {
      if (typeof p.price !== "number") {
        throw new Error("Invalid price value in second array");
      }
      return p.price;
    });

    const meanX = x.reduce((sum, val) => sum + val, 0) / n;
    const meanY = y.reduce((sum, val) => sum + val, 0) / n;

    let numerator = 0;
    let denominatorX = 0;
    let denominatorY = 0;

    for (let i = 0; i < n; i++) {
      const diffX = x[i] - meanX;
      const diffY = y[i] - meanY;
      numerator += diffX * diffY;
      denominatorX += diffX * diffX;
      denominatorY += diffY * diffY;
    }

    if (denominatorX === 0 || denominatorY === 0) {
      return 0;
    }

    return numerator / Math.sqrt(denominatorX * denominatorY);
  }
}

module.exports = new StockService();
