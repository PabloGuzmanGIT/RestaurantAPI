const db = require('../models/db');

exports.recordCheckout = async (req, res) => {
  const { tableNumber, totalAmount } = req.body;
  const { restaurantId } = req.user;
  try {
    await db.query(
      'INSERT INTO table_checkouts (id, table_number, restaurant_id, total_amount, status, created_at, paid_at) VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())',
      [tableNumber, restaurantId, totalAmount, 'paid']
    );
    res.json({ message: 'Checkout recorded' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCheckouts = async (req, res) => {
  const { restaurantId } = req.user;
  try {
    const result = await db.query('SELECT * FROM table_checkouts WHERE restaurant_id = $1', [restaurantId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
