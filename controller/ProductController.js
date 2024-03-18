#!/usr/bin/env node

import User from '../models/user';
import Product from '../models/product';
import redisClient from '../utils/redis';

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Operations related to products.
 */
class ProductController {

  /**
   * @swagger
   * /api/product:
   *   post:
   *     tags:
   *       - Products
   *     security:
   *       - ApiKeyAuth: []
   *     summary: Get all products
   *     description: Retrieve a list of all products
   *     responses:
   *       200:
   *         description: A list of products
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   */
  static async postNew(req, res) {
    const token = req.header('X-Token');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    return User
      .findOne({ id: userId })
      .then((user) => {
        if (!user) return res.status(401).json({ error: 'Unauthorized' });

        const { name } = req.body;
        const { title } = req.body;
        const { price } = req.body;

        if (!name) return res.status(400).json({ error: 'Missing name' });

        return Product
          .findOne({ name })
          .then((product) => {
            if (product) return res.status(400).json({ error: 'Already Exists' });

            const newProduct = Product({
              name,
              title: title || '',
              price: price || ''
            });

            return newProduct.save()
              .then((result, err) => {
                if (err) return res.status(400).json({ error: err });

                res.status(201).json({ id: result._id, name: result.name, title: result.title });
              })
              .catch((err) => {
                return res.status(500).json({ error: err });
              });
          });
      })
      .catch((err) => {
        return res.status(500).json({ error: err });
      });
  }

  /**
   * 
   * @param {*} req 
   * @param {*} res 
   * @returns 
   * 
   * @swagger
   * /products:
   *   get:
   *     tags:
   *       - Products
   *     summary:
   *       - 
   */
  static async getProducts(req, res) {
    const token = req.header('X-Token');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const key = `auth_${token}`;
    const userId = redisClient.get(key);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    return User
      .findOne({ _id: userId })
      .then((user) => {
        if (!user) return res.status(401).json({ error: unauthorized })

        return Product
          .find((products) => {
            return res.status(200).json({ data: products })
          })
          .catch((err) => {
            return res.status(500).json({ error: err })
          })
      })
      .catch((err) => {
        return res.status(500).json({ error: err })
      })
  }
}

export default ProductController;
