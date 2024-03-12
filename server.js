#!/usr/bin/env node
import express from 'express';

const app = express();
const PORT = process.env.POPT || 4000;

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
})