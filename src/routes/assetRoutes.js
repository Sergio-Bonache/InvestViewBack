const express = require('express');
const router = express.Router();
const {
  createAsset,
  getAllAssets,
  getAssetById,
  getAssetByTicker,
  updateAsset,
  deleteAsset
} = require('../controllers/assetController');

router.post('/', createAsset);
router.get('/', getAllAssets);
router.get('/:id', getAssetById);
router.get('/:ticker', getAssetByTicker);
router.put('/:id', updateAsset);
router.delete('/:id', deleteAsset);

module.exports = router;