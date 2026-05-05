const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '..', '.env');
const envExamplePath = path.join(__dirname, '..', '..', '.env.example');

const loadEnv = () => {
  if (!process.env.MONGO_URI) {
    if (fs.existsSync(envPath)) {
      require('dotenv').config({ path: envPath });
    } else if (fs.existsSync(envExamplePath)) {
      require('dotenv').config({ path: envExamplePath });
    }
  }
};

loadEnv();

const connectDB = async () => {
  let mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    mongoUri = 'mongodb://127.0.0.1:27017/aviator';
    console.warn(
      'MONGO_URI is not set. Falling back to local MongoDB at mongodb://127.0.0.1:27017/aviator'
    );
  }

  if (mongoUri.includes('xxxxx') || mongoUri.includes('your-cluster')) {
    throw new Error(
      'MONGO_URI contains placeholder values. Replace the host with your actual MongoDB Atlas cluster address.'
    );
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.error(
        'Verify your MONGO_URI host and DNS/Atlas network access. If using Atlas, ensure your IP is whitelisted and the cluster hostname is correct.'
      );
    }
    process.exit(1);
  }
};

module.exports = connectDB;
