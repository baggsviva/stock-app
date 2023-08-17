import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';

const StockData = () => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // Initialize error state
  const canvasRef = useRef(null); // Create a ref for the canvas element
  const chartRef = useRef(null); // Create a ref for the Chart instance

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=5min&apikey=${process.env.REACT_APP_ALPHA_VANTAGE_API_KEY}`);
        setData(response.data);
        setIsLoading(false);
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('An error occurred while fetching data from the API.');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!isLoading && !error) {
      if (chartRef.current) {
        chartRef.current.destroy(); // Destroy the existing Chart instance
      }
      createChart(data['Time Series (5min)']);
    }
  }, [isLoading, error, data]);

  const createChart = timeSeriesData => {
    const labels = Object.keys(timeSeriesData).reverse();
    const dataPoints = labels.map(label => timeSeriesData[label]['1. open']);

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Opening Price',
              data: dataPoints,
              borderColor: 'blue',
              borderWidth: 1,
              fill: false,
            },
          ],
        },
        options: {
          // ...
        },
      });
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4 text-center">Stock Data</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="bg-white rounded-md shadow-md p-4">
          {/* ... */}
          <div className="mt-4">
            <canvas ref={canvasRef} id="stockChart" width="400" height="200"></canvas>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockData;
