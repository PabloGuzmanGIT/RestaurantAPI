const db = require('../models/db');

exports.createUser = async (req, res) => {
  const { email, password, role } = req.body;
  const { restaurantId } = req.user;
  try {
    const hashedPassword = await require('bcrypt').hash(password, 10);
    await db.query(
      'INSERT INTO users (id, email, password_hash, role, restaurant_id) VALUES (gen_random_uuid(), $1, $2, $3, $4)',
      [email, hashedPassword, role, restaurantId]
    );
    res.json({ message: 'User created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listUsers = async (req, res) => {
  const { restaurantId } = req.user;
  try {
    const result = await db.query('SELECT id, email, role FROM users WHERE restaurant_id = $1', [restaurantId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
