const stockService = require("../services/stockService");

const getStockHistory = async (req, res, next) => {
  try {
    const { ticker } = req.params;
    const { minutes } = req.query;

    if (!minutes || isNaN(minutes)) {
      return res.status(400).json({
        success: false,
        error: "Minutes parameter is required and must be a number",
      });
    }

    const stockData = await stockService.getStockHistory(
      ticker,
      parseInt(minutes)
    );
    const average = stockService.calculateAverage(stockData);
    const standardDeviation =
      stockService.calculateStandardDeviation(stockData);

    res.json({
      success: true,
      data: {
        ticker,
        average,
        standardDeviation,
        priceHistory: stockData,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getStockCorrelation = async (req, res, next) => {
  try {
    const { minutes, ticker } = req.query;

    if (!minutes || isNaN(minutes)) {
      return res.status(400).json({
        success: false,
        error: "Minutes parameter is required and must be a number",
      });
    }

    if (!Array.isArray(ticker) || ticker.length !== 2) {
      return res.status(400).json({
        success: false,
        error: "Exactly two tickers must be provided",
      });
    }

    const [stock1Data, stock2Data] = await Promise.all([
      stockService.getStockHistory(ticker[0], parseInt(minutes)),
      stockService.getStockHistory(ticker[1], parseInt(minutes)),
    ]);

    const correlation = stockService.calculateCorrelation(
      stock1Data,
      stock2Data
    );
    const average1 = stockService.calculateAverage(stock1Data);
    const average2 = stockService.calculateAverage(stock2Data);
    const stdDev1 = stockService.calculateStandardDeviation(stock1Data);
    const stdDev2 = stockService.calculateStandardDeviation(stock2Data);

    res.json({
      success: true,
      data: {
        correlation,
        stocks: {
          [ticker[0]]: {
            averagePrice: average1,
            standardDeviation: stdDev1,
            priceHistory: stock1Data,
          },
          [ticker[1]]: {
            averagePrice: average2,
            standardDeviation: stdDev2,
            priceHistory: stock2Data,
          },
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAllStocks = async (req, res, next) => {
  try {
    const stocks = await stockService.getAllStocks();
    res.json({
      success: true,
      data: stocks,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStockHistory,
  getStockCorrelation,
  getAllStocks,
};
