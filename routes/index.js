#!/usr/bin/env node
import express from 'express';
import AppController from '../controller/AppController';
import UserController from '../controller/UserController';
import AuthController from '../controller/AuthController';
import ProductController from '../controller/ProductController';

const router = express.Router();

router
  .get('/stats', AppController.getStats)
  .get('/status', AppController.getStatus);

router
  .post('/users', UserController.postNew);

router
  .get('/connect', AuthController.getConnect)
  .get('/users/me', UserController.getMe)
  .get('/disconnect', AuthController.getDisconnect);

router
  .get('/products', ProductController.getProducts)
  .post('/products', ProductController.postNew);

export default router;
