#!/usr/bin/env node

class AppController {
  static getStatus (req, res) {
    return res.status(200).json({ redis: false, db: false });
  }

  static getStats (req, res) {
    return res.status(200).json({ users: 0, products: 0 });
  }
}

export default AppController;
