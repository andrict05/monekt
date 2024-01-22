import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './expressApp.js';

dotenv.config({ path: './config.env' });

const port = process.env.PORT || 80;
let server;

const databaseURL = `${process.env.MONGODB_DATABASE_URL.replace(
  `<password>`,
  process.env.MONGODB_PASSWORD,
)}`;
mongoose
  .connect(databaseURL, { dbName: 'monekt' })
  .then(() => {
    console.log('Database connection established.');
    server = app.listen(port, () => {
      console.log(`Application running on port: ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error while connecting to database, exiting.');
    process.exit(1);
  });

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled rejection!');
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.log('Uncaught exception!');
  console.log(err.name, err.message);
  process.env.NODE_ENV.trim() === 'development' && console.log(err.stack);
  process.exit(1);
});
