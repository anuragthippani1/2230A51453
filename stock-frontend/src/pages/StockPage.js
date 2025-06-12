import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Paper,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

const STOCKS_API = "/stocks"; // Backend API for stocks list
const PRICE_API = "/stocks"; // Backend API for stock prices
const AVERAGE_API = "/stocks"; // Backend API for average price

const TIME_OPTIONS = [5, 10, 30, 50, 120];

function StockPage() {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState("");
  const [minutes, setMinutes] = useState(30);
  const [priceData, setPriceData] = useState([]);
  const [average, setAverage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(STOCKS_API).then((res) => {
      const stockList = Array.isArray(res.data.data)
        ? res.data.data.map((ticker) => ({ name: ticker, ticker }))
        : [];
      setStocks(stockList);
      if (stockList.length > 0) setSelectedStock(stockList[0].ticker);
    });
  }, []);

  useEffect(() => {
    if (!selectedStock) return;
    setLoading(true);
    axios
      .get(`${PRICE_API}/${selectedStock}?minutes=${minutes}`)
      .then((res) => setPriceData(res.data.priceHistory || res.data))
      .catch(() => setPriceData([]));
    axios
      .get(
        `${AVERAGE_API}/${selectedStock}?minutes=${minutes}&aggregation=average`
      )
      .then((res) => setAverage(res.data.averageStockPrice))
      .catch(() => setAverage(null))
      .finally(() => setLoading(false));
  }, [selectedStock, minutes]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Stock Page
      </Typography>
      <Paper sx={{ p: 2, mb: 2, display: "flex", gap: 2 }}>
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Stock</InputLabel>
          <Select
            value={selectedStock}
            label="Stock"
            onChange={(e) => setSelectedStock(e.target.value)}
          >
            {stocks.map((stock) => (
              <MenuItem key={stock.ticker} value={stock.ticker}>
                {stock.name} ({stock.ticker})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Minutes</InputLabel>
          <Select
            value={minutes}
            label="Minutes"
            onChange={(e) => setMinutes(e.target.value)}
          >
            {TIME_OPTIONS.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt} min
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>
      {loading ? (
        <CircularProgress />
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={priceData}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="lastUpdatedAt"
              tickFormatter={(str) => str && str.slice(11, 19)}
            />
            <YAxis />
            <Tooltip
              formatter={(value) => value.toFixed(2)}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Line type="monotone" dataKey="price" stroke="#1976d2" dot />
            {average && (
              <ReferenceLine
                y={average}
                label="Avg"
                stroke="red"
                strokeDasharray="3 3"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
}

export default StockPage;
