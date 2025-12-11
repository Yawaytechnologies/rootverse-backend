import app from './app.js';
import connectDB from './config/db.js';
import config from './config/env.js';

const startServer = async () => {
  try {
    app.listen(config.port, async () => {
      console.log(`Server is running on ✨"http://localhost:${config.port}"✨`);
      await connectDB();
    });
  } catch (error) {
    console.error('Server failed to start:', error.message);
    process.exit(1);
  } 
};

startServer();