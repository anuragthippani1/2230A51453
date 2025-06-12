// routes/stockRoutes.js

const express = require("express");
const router = express.Router();
const {
  getStockHistory,
  getStockCorrelation,
  getAllStocks,
} = require("../controllers/stockController");
const authenticate = require("../middleware/auth");

// Apply authentication middleware to all routes
router.use(authenticate);

// GET /stocks - Get all available stocks
router.get("/stocks", getAllStocks);

// Route: GET /api/stocks/:ticker?minutes=60
router.get("/stocks/:ticker", getStockHistory);

// Route: GET /api/stockcorrelation?ticker=AAPL&ticker=GOOG&minutes=60
router.get("/stockcorrelation", getStockCorrelation);

module.exports = router;
