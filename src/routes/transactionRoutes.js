const express = require('express');
const router = express.Router();
const {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getUserAssetQuantity,
  getUserPortfolio
} = require('../controllers/transactionController');

router.post('/', createTransaction);
router.get('/', getAllTransactions);
router.get('/:id', getTransactionById);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

// Nueva ruta para obtener la suma de quantity de un usuario en un activo
router.get('/user/:user_id/asset/:asset_id/quantity', getUserAssetQuantity);

router.get('/portfolio/:user_id', getUserPortfolio);

module.exports = router;