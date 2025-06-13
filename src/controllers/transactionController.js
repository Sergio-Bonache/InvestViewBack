const db = require('../config/db');

// Crear una nueva transacción
exports.createTransaction = (req, res) => {
  const { user_id, asset_id, transaction_type, quantity } = req.body;

  if (!user_id || !asset_id || !transaction_type || !quantity) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  const query = `
    INSERT INTO transactions (user_id, asset_id, transaction_type, quantity)
    VALUES (?, ?, ?, ?)
  `;
  db.query(query, [user_id, asset_id, transaction_type, quantity], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({
      id: result.insertId,
      user_id,
      asset_id,
      transaction_type,
      quantity
    });
  });
};

// Obtener todas las transacciones
exports.getAllTransactions = (req, res) => {
  const query = 'SELECT * FROM transactions';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Obtener una transacción por ID
exports.getTransactionById = (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM transactions WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) {
      return res.status(404).json({ message: 'Transacción no encontrada' });
    }
    res.json(results[0]);
  });
};

// Actualizar una transacción
exports.updateTransaction = (req, res) => {
  const { id } = req.params;
  const { user_id, asset_id, transaction_type, quantity } = req.body;

  if (!user_id || !asset_id || !transaction_type || !quantity) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  const query = `
    UPDATE transactions
    SET user_id = ?, asset_id = ?, transaction_type = ?, quantity = ?
    WHERE id = ?
  `;
  db.query(query, [user_id, asset_id, transaction_type, quantity, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Transacción no encontrada' });
    }
    res.json({ message: 'Transacción actualizada correctamente' });
  });
};

// Eliminar una transacción
exports.deleteTransaction = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM transactions WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Transacción no encontrada' });
    }
    res.json({ message: 'Transacción eliminada correctamente' });
  });
};

// Obtener la suma de quantity de un usuario para un activo específico
exports.getUserAssetQuantity = (req, res) => {
  const { user_id, asset_id } = req.params;

  const query = `
    SELECT IFNULL(SUM(
      CASE 
        WHEN transaction_type = 'compra' THEN quantity
        WHEN transaction_type = 'venta' THEN -quantity
        ELSE 0
      END
    ), 0) AS total_quantity
    FROM transactions
    WHERE user_id = ? AND asset_id = ?
  `;
  db.query(query, [user_id, asset_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ total_quantity: results[0].total_quantity });
  });
};

// Obtener el portfolio de un usuario 
exports.getUserPortfolio = (req, res) => {
  const { user_id } = req.params;

  const query = `
    SELECT 
      a.id AS asset_id,
      a.name,
      a.logo_url,
      a.trading_view_symbol,
      a.asset_type,
      SUM(
        CASE 
          WHEN t.transaction_type = 'compra' THEN t.quantity
          WHEN t.transaction_type = 'venta' THEN -t.quantity
          ELSE 0
        END
      ) AS total_quantity
    FROM transactions t
    JOIN assets a ON t.asset_id = a.id
    WHERE t.user_id = ?
    GROUP BY a.id, a.name, a.logo_url
    HAVING total_quantity > 0
  `;

  db.query(query, [user_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
