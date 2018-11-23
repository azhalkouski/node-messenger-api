import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import config from '../config';
import routes from './routes'

const app = express();
const port = process.env.PORT || config.port || 3000;

app.set('port', port);
mongoose.connect(config.mongoose.uri, config.mongoose.options);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1/', routes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something went wrong');
});

module.exports = app;
