const express = require('express');
const path = require('path');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable gzip compression
app.use(compression());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist/my-angular-app')));

// Route all requests to index.html for client-side routing
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/my-angular-app/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});