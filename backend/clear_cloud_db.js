require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const clearDatabase = async () => {
  try {
    console.log("Connecting to Cloud Database...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB Atlas!");

    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      console.log(`Clearing collection: ${collection.collectionName}`);
      await collection.deleteMany({});
    }

    console.log("All collections have been cleared successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error clearing database:", error);
    process.exit(1);
  }
};

clearDatabase();
