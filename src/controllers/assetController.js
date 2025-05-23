const db = require('../config/db');

// Crear un nuevo activo
exports.createAsset = (req, res) => {
  const { name, description, asset_type, trading_view_symbol, logo_url } = req.body;

  if (!name || !description || !asset_type || !trading_view_symbol || !logo_url) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  const query = 'INSERT INTO assets (name, description, asset_type, trading_view_symbol, logo_url) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [name, description, asset_type, trading_view_symbol, logo_url], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, name, description, asset_type, trading_view_symbol, logo_url });
  });
};

// Obtener todos los activos
exports.getAllAssets = (req, res) => {
  const query = 'SELECT * FROM assets';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Obtener un activo por ID
exports.getAssetById = (req, res) => {
  const { id } = req.params;

  const query = 'SELECT * FROM assets WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) {
      return res.status(404).json({ message: 'Activo no encontrado' });
    }
    res.json(results[0]);
  });
};


// Obtener un activo por ticker
exports.getAssetByTicker = (req, res) => {
  const { ticker } = req.params;

  const query = 'SELECT * FROM assets WHERE trading_view_symbol = ?';
  db.query(query, [ticker], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) {
      return res.status(404).json({ message: 'Activo no encontrado' });
    }
    res.json(results[0]);
  });
};

// Actualizar un activo
exports.updateAsset = (req, res) => {
  const { id } = req.params;
  const { name, description, asset_type, trading_view_symbol, logo_url } = req.body;

  if (!name || !description || !asset_type || !trading_view_symbol || !logo_url) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  const query = 'UPDATE assets SET name = ?, description = ?, asset_type = ?, trading_view_symbol = ?, logo_url = ? WHERE id = ?';
  db.query(query, [name, description, asset_type, trading_view_symbol, logo_url, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Activo no encontrado' });
    }
    res.json({ message: 'Activo actualizado correctamente' });
  });
};

// Eliminar un activo
exports.deleteAsset = (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM assets WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Activo no encontrado' });
    }
    res.json({ message: 'Activo eliminado correctamente' });
  });
};