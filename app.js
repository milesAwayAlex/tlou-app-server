import dotenv from 'dotenv';
import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import mongoose from 'mongoose';

import router from './src/router.js';

dotenv.config();

const app = express();
mongoose.connect(process.env.MONGODBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB conneiction error:'));

app.use(compression());
app.use(helmet());
app.use('/api', (req, res, next) => {
  // set the res header to allow access from ALLOWORIGIN
  res.set('Access-Control-Allow-Origin', process.env.ALLOWORIGIN);
  // set the security headers
  res.set(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});
app.use('/api', router);

app.listen(process.env.PORT, () => {
  console.log(`TLoU App listening at http://localhost:${process.env.PORT}`);
});
