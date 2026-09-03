const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.log('ℹ️ MONGODB_URI not provided in backend/.env. Running with in-memory JSON data store.');
    return false;
  }

  try {
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Connected Successfully to Cloud Cluster!');
    return true;
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    return false;
  }
};

module.exports = connectDB;
