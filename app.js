require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./utils/rate-limiter');
const { dbdev } = require('./utils/config');

const errorHandler = require('./middlewares/errorHandler');
const routes = require('./routes/index');

const { PORT = 3000, NODE_ENV, DB_URL } = process.env;

const app = express();

mongoose.set('toObject', { useProjection: true });
mongoose.set('toJSON', { useProjection: true });

mongoose.connect(
  NODE_ENV === 'production' ? DB_URL : dbdev,
  { useNewUrlParser: true },
);

app.use(cors()); // {origin: ['https://asuleymanova.nomoredomains.icu', 'http://localhost:3001'],}

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.use(limiter);

app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
