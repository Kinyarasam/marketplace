#!/usr/bin/env node

import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: String,
  name: String,
  price: String
});

const Product = mongoose.model('Product', productSchema);

export default Product;
