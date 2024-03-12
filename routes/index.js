#!/usr/bin/env node
import express from 'express';
import AppController from '../controller/AppController';
import UserController from '../controller/UserController';
import AuthController from '../controller/AuthController';

const router = express.Router();

router
  .get('/stats', AppController.getStats)
  .get('/status', AppController.getStatus)

router
  .post('/users', UserController.postNew)

router
  .get('/connect', AuthController.getConnect)

export default router;
