#!/usr/bin/env node

import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: String,
  productId: String,
  quantity: Integer
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
