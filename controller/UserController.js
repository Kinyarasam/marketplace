#!/usr/bin/env node

import crypto from "crypto";
import User from "../models/user";
import redisClient from "../utils/redis";

class UserController {
  static postNew(req, res) {
    const { email } = req.body;
    const { password } = req.body;
    const { first_name } = req.body;
    const { last_name } = req.body;

    if (!email) return res.status(400).json({ error: 'missing email' });
    if (!password) return res.status(400).json({ error: 'missing password' });

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) return res.status(400).json({ error: 'invalid email' });

    const hash = crypto.createHash('sha512')
    const encryptedPassword = hash.update(password);
    const hashedPassword = encryptedPassword.digest('hex');

    return User
      .findOne({ email: email, password: hashedPassword })
      .then((user, err) => {
        if (err) return res.status(500).json({ error: `Server error: ${err}` });

        if (user) {
          return res.status(400).json({ error: 'User already exists' })
        }

        /**
         * Create a new User
         */

        const new_user = new User({
          email: email,
          password: hashedPassword,
          first_name: first_name || '',
          last_name: last_name || '',
        })


        return new_user
          .save()
          .then((rec, err) => {
            if (err) return res.status(401).json({ error: `Some Error writing new user: ${err}` });

            return res.status(200).json(rec);
          })
          .catch((err) => { return res.status(401).json({ error: `Unable to save record: ${err}` }) })
      })
      .catch((err) => { return res.status(401).json({ error: `Unable to save record: ${err}` }) })
  }

  static async getMe(req, res) {
    const token = req.header('X-Token');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    return User
      .findOne({ _id: userId })
      .then((user) => {
        if (!user) return res.status(401).json({ error: 'Unauthorized' });

        return res.status(200).json({ id: user._id, email: user.email })
      })
      .catch((err) => {
        res.status(401).json({ error: 'Unauthorized' });
      })
  }
}

export default UserController;
