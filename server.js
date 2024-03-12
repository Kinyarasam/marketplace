#!/usr/bin/env node
import express from 'express';
import router from './routes';
import morgan from 'morgan';
import dotenv from 'dotenv';
import dbClient from "./config/db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json())
app.use(morgan('combined'));
app.use('/', router);

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
