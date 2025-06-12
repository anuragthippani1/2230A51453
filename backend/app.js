// question1/app.js

require("dotenv").config();
const express = require("express");
const stockService = require("./services/stockService");

const app = express();
const PORT = process.env.PORT || 7000;

/**
 * GET /average
 * Query Parameters:
 *  - ticker: Stock ticker symbol (string)
 *  - minutes: Time range in minutes (number)
 */
app.get("/average", async (req, res) => {
  try {
    const { ticker, minutes } = req.query;

    if (!ticker || !minutes) {
      return res.status(400).json({
        success: false,
        error: "Missing required query parameters: ticker and minutes",
      });
    }

    const parsedMinutes = parseInt(minutes, 10);
    const prices = await stockService.getStockHistory(ticker, parsedMinutes);
    const average = stockService.calculateAverage(prices);

    res.json({ success: true, ticker, average });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /correlation
 * Query Parameters:
 *  - ticker1: First stock ticker symbol (string)
 *  - ticker2: Second stock ticker symbol (string)
 *  - minutes: Time range in minutes (number)
 */
app.get("/correlation", async (req, res) => {
  try {
    const { ticker1, ticker2, minutes } = req.query;

    if (!ticker1 || !ticker2 || !minutes) {
      return res.status(400).json({
        success: false,
        error:
          "Missing required query parameters: ticker1, ticker2, and minutes",
      });
    }

    const parsedMinutes = parseInt(minutes, 10);

    const prices1 = await stockService.getStockHistory(ticker1, parsedMinutes);
    const prices2 = await stockService.getStockHistory(ticker2, parsedMinutes);
    const correlation = stockService.calculateCorrelation(prices1, prices2);

    res.json({
      success: true,
      ticker1,
      ticker2,
      correlation,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get("/", (req, res) => {
  res.send("Stock API microservice is running 🚀");
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
