#!/usr/bin/env node
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.MONGO_URI;
console.log(connectionString)
const conn = mongoose.connect(connectionString)

const isConnected = conn.then()
const isError = conn.catch()

console.log(isConnected)
export default conn;