#!/usr/bin/env node
import User from "../models/user";
import crypto from 'crypto';
import { v4 as uuidv4 } from "uuid";
import redisClient from "../utils/redis";

class AuthController {
  static getConnect(req, res) {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

    const userCredentials = authHeader.split(' ')[1];
    if (!userCredentials) return res.status(401).json({ error: 'Unauthorized' });

    const userData = Buffer.from(userCredentials, 'base64').toString('utf-8');

    let password = undefined;
    let email = undefined;

    try {
      [email, password] = userData.split(':')
    } catch(err) {
      return res.status(401).json({error: 'Unauthorized'});
    }

    if (!email || !password) return res.status(401).json({ error: 'Unauthorized' });

    const hash = crypto.createHash('sha512')
    const encryptedPassword = hash.update(password);
    const hashedPassword = encryptedPassword.digest('hex');

    return User
      .findOne({email: email, password: hashedPassword})
      .then(async (user, err) => {
        if (err) throw new Error(err);

        if (!user) return res.status(404).json({ error: 'Not Found' });

        /**
         * Generate a token
         */
        const token = uuidv4();
        const key = `auth_${token}`;
        await redisClient.set(key, user._id.toString(), 60 * 60 * 24)

        return res.status(200).json({ token: token });
      })
  }
}

export default AuthController;
