#!/usr/bin/env node
import User from '../models/user';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import redisClient from '../utils/redis';

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Operations related to authorization.
 */
class AuthController {
  /**
   * @swagger
   * /connect:
   *   get:
   *     tags:
   *       - Authentication
   *     summary: 
   *       - Authorization
   *     security:
   *       - ApiKeyAuth: []
   *     responses:
   *       200:
   *         description: request executed successfully
   *         schema:
   *           properties:
   *             token:
   *               type: string
   *       401:
   *         description: Unauthorized
   */
  static getConnect (req, res) {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

    const userCredentials = authHeader.split(' ')[1];
    if (!userCredentials) return res.status(401).json({ error: 'Unauthorized' });

    const userData = Buffer.from(userCredentials, 'base64').toString('utf-8');

    let password;
    let email;

    try {
      [email, password] = userData.split(':');
    } catch (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!email || !password) return res.status(401).json({ error: 'Unauthorized' });

    const hash = crypto.createHash('sha512');
    const encryptedPassword = hash.update(password);
    const hashedPassword = encryptedPassword.digest('hex');

    return User
      .findOne({ email, password: hashedPassword })
      .then(async (user, err) => {
        if (err) throw new Error(err);

        if (!user) return res.status(404).json({ error: 'Not Found' });

        /**
         * Generate a token
         */
        const token = uuidv4();
        const key = `auth_${token}`;
        await redisClient.set(key, user._id.toString(), 60 * 60 * 24);

        return res.status(200).json({ token });
      });
  }

  /**
   * @swagger
   * /disconnect:
   *   get:
   *     tags:
   *       - Authentication
   *     summary: 
   *       - Log out an active user.
   *     security:
   *       - ApiKeyAuth: []
   *     responses:
   *       200:
   *         description: request executed successfully
   *       401:
   *         description: Unauthorized
   */
  static async getDisconnect (req, res) {
    const token = req.header('X-Token');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    if (!userId) res.status(401).json({ error: 'Unauthorized' });

    await redisClient.del(key);
    return res.status(204).json({});
  }
}

export default AuthController;
