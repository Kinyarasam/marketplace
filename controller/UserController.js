#!/usr/bin/env node

import crypto from 'crypto';
import User from '../models/user';
import redisClient from '../utils/redis';


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Operations related to users.
 */
class UserController {

  /**
   * @swagger
   * /users:
   *   tags:
   *     - Users
   *   post:
   *     summary: Create a new user
   *     description: Creates a new user with the provided email and password
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *               firstName:
   *                 type: string
   *               lastName:
   *                 type: string
   *     security:
   *       X-Token: []
   *     responses:
   *       200:
   *         description: User created successfully
   *       400:
   *         description: Bad request
   */
  static postNew(req, res) {
    const { email } = req.body;
    const { password } = req.body;
    const { firstName } = req.body;
    const { lastName } = req.body;

    if (!email) return res.status(400).json({ error: 'missing email' });
    if (!password) return res.status(400).json({ error: 'missing password' });

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) return res.status(400).json({ error: 'invalid email' });

    const hash = crypto.createHash('sha512');
    const encryptedPassword = hash.update(password);
    const hashedPassword = encryptedPassword.digest('hex');

    return User
      .findOne({ email, password: hashedPassword })
      .then((user, err) => {
        if (err) return res.status(500).json({ error: `Server error: ${err}` });

        if (user) {
          return res.status(400).json({ error: 'User already exists' });
        }

        /**
         * Create a new User
         */
        const newUser = new User({
          email,
          password: hashedPassword,
          firstName: firstName || '',
          lastName: lastName || ''
        });

        return newUser
          .save()
          .then((rec, err) => {
            if (err) return res.status(401).json({ error: `Some Error writing new user: ${err}` });

            return res.status(200).json(rec);
          })
          .catch((err) => { return res.status(401).json({ error: `Unable to save record: ${err}` }); });
      })
      .catch((err) => { return res.status(401).json({ error: `Unable to save record: ${err}` }); });
  }

  /**
   * @swagger
   * /api/user/me:
   *   get:
   *     summary: Get current user details
   *     description: Retrieves details of the current user based on the provided token
   *     security:
   *       - X-Token: []
   *     responses:
   *       200:
   *         description: Successful operation
   *       401:
   *         description: Unauthorized
   */
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

        return res.status(200).json({ id: user._id, email: user.email });
      })
      .catch((err) => {
        return res.status(401).json({ error: err });
      });
  }
}

export default UserController;
