const db = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerOwner = async (req, res) => {
  const { email, password, restaurantName } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const restaurantResult = await db.query(
      'INSERT INTO restaurants (id, name) VALUES (gen_random_uuid(), $1) RETURNING id',
      [restaurantName]
    );
    const restaurantId = restaurantResult.rows[0].id;
    const userResult = await db.query(
      'INSERT INTO users (id, email, password_hash, role, restaurant_id) VALUES (gen_random_uuid(), $1, $2, $3, $4) RETURNING id',
      [email, hashedPassword, 'owner', restaurantId]
    );
    res.json({ message: 'Owner registered', userId: userResult.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { userId: user.id, restaurantId: user.restaurant_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
