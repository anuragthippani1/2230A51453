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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";

const STOCKS_API = "/stocks";
const CORRELATION_API = "/stockcorrelation";
const TIME_OPTIONS = [5, 10, 30, 50, 120];

function CorrelationHeatmap() {
  const [stocks, setStocks] = useState([]);
  const [minutes, setMinutes] = useState(30);
  const [correlations, setCorrelations] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(STOCKS_API).then((res) => {
      const stockList = Array.isArray(res.data.data) ? res.data.data : [];
      setStocks(stockList);
    });
  }, []);

  useEffect(() => {
    if (stocks.length === 0) return;
    setLoading(true);
    const fetchAllCorrelations = async () => {
      let corrData = {};
      for (let i = 0; i < stocks.length; i++) {
        corrData[stocks[i]] = {};
        for (let j = 0; j < stocks.length; j++) {
          if (i === j) {
            corrData[stocks[i]][stocks[j]] = 1;
            continue;
          }
          try {
            const res = await axios.get(
              `${CORRELATION_API}?minutes=${minutes}&ticker=${stocks[i]}&ticker=${stocks[j]}`
            );
            corrData[stocks[i]][stocks[j]] = res.data.correlation;
          } catch {
            corrData[stocks[i]][stocks[j]] = null;
          }
        }
      }
      setCorrelations(corrData);
      setLoading(false);
    };
    fetchAllCorrelations();
  }, [stocks, minutes]);

  const getColor = (value) => {
    if (value === 1) return "#1976d2"; // self
    if (value === null || isNaN(value)) return "#eee";
    if (value > 0.7) return "#388e3c"; // strong positive
    if (value > 0.3) return "#81c784"; // moderate positive
    if (value > -0.3) return "#fffde7"; // weak
    if (value > -0.7) return "#ffb74d"; // moderate negative
    return "#d32f2f"; // strong negative
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Correlation Heatmap
      </Typography>
      <Paper sx={{ p: 2, mb: 2, display: "flex", gap: 2 }}>
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
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                {stocks.map((ticker) => (
                  <TableCell key={ticker} align="center">
                    {ticker}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {stocks.map((rowTicker) => (
                <TableRow key={rowTicker}>
                  <TableCell component="th" scope="row">
                    {rowTicker}
                  </TableCell>
                  {stocks.map((colTicker) => (
                    <TableCell
                      key={colTicker}
                      align="center"
                      style={{
                        background: getColor(
                          correlations[rowTicker]?.[colTicker]
                        ),
                        color: "#222",
                      }}
                    >
                      {correlations[rowTicker]?.[colTicker] !== null &&
                      correlations[rowTicker]?.[colTicker] !== undefined
                        ? correlations[rowTicker][colTicker].toFixed(2)
                        : "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default CorrelationHeatmap;
