const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const pagesRouter = require('./routes/posts.js'); 
const postsRouter = require('./models/Post.js');

const app = express();
const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public');


const mongoose = require('mongoose');

async function connectToDatabase() {
  if (!process.env.MONGODB_URI) {
    console.warn("MONGODB_URI is missing. Create a .env file in backend/ before testing database features.");
    return; //
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'blog' });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
  }
}

async function connectToDatabase() {
  // Your code here
  throw new Error('connectToDatabase not implemented. See TODO above.')
}

app.locals.publicDir = publicDir;
app.use(express.json());
app.use(express.static(publicDir));

app.use('/', pagesRouter);
app.use('/api/posts', postsRouter);

app.use((req, res) => {
  res.status(404).sendFile(path.join(publicDir, '404.html'));
});

app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).sendFile(path.join(publicDir, '500.html'));
});

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Mounted routers:');
    console.log('  / -> routes/pages.js');
    console.log('  /api/posts -> routes/posts.js');
  });
});