#!/usr/bin/env node

class UserController {
  static postNew(req, res) {
    const { email } = req.body;
    const { password } = req.body;

    if (!email) return res.status(400).json({ error: 'missing email' });
    if (!password) return res.status(400).json({ error: 'missing password' });

    // const users = 
  }
}

export default UserController;
