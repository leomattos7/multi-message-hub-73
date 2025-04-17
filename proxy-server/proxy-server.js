const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:8080',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-uuid', 'Origin', 'X-Requested-With'],
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Proxy endpoint for all API requests
app.all('/api/*', async (req, res) => {
  try {
    const targetUrl = `https://2suwazl6jc.execute-api.sa-east-1.amazonaws.com/serveless_health_prod${req.path}`;
    
    console.log('Proxying request to:', targetUrl);
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);

    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: {
        'Content-Type': 'application/json',
        'x-uuid': req.headers['x-uuid'] || '123'
      }
    });

    console.log('Response status:', response.status);
    console.log('Response data:', response.data);

    // Forward all response headers from the API Gateway
    Object.entries(response.headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Proxy error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      }
    });

    // Send appropriate error response
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      res.status(error.response.status).json({
        error: error.message,
        details: error.response.data
      });
    } else if (error.request) {
      // The request was made but no response was received
      res.status(504).json({
        error: 'No response received from the server',
        details: error.message
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      res.status(500).json({
        error: 'Error setting up the request',
        details: error.message
      });
    }
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    details: err.message
  });
});

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
}); 