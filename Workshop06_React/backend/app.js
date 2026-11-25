const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const postsRouter = require('./routes/posts.js');

const app = express();
const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

async function connectToDatabase() {
  if (!process.env.MONGODB_URI) {
    console.warn("MONGODB_URI is missing. Create a .env file.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'blog' });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
  }
}

app.use(express.json());

app.use('/api/posts', postsRouter);

app.get('/', (req, res) => {
  res.send('backend is running.');
});

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});