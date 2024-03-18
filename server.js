#!/usr/bin/env node
import express from 'express';
import router from './routes';
import morgan from 'morgan';
import dotenv from 'dotenv';
import dbClient from './config/db';
import swaggerDocs from './routes/documentation/swagger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
swaggerDocs(app);

app.use(express.json());
app.use(morgan('combined'));
app.use('/', router);

const startServer = async (port) => {
  app.listen(port, () => {
    console.log(`Running on port ${port}`);
  });
};

startServer(PORT)

export default app;
