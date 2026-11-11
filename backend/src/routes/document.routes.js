const express = require('express');
const multer = require('multer');
const { randomUUID } = require('node:crypto');
const { mkdir } = require('node:fs');
const path = require('node:path');
const documentController = require('../controllers/document.controller');

const router = express.Router();
const storagePath = path.resolve(__dirname, '../../storage');
const storage = multer.diskStorage({
  destination(req, file, callback) {
    mkdir(storagePath, { recursive: true }, (error) => callback(error, storagePath));
  },
  filename(req, file, callback) {
    callback(null, randomUUID());
  },
});
const upload = multer({ storage }).single('file');

router.post('/upload', (req, res, next) => {
  upload(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ error: 'Arquivo de envio inválido.' });
    }
    if (error) {
      return next(error);
    }
    return documentController.upload(req, res, next).catch(next);
  });
});
router.get('/documents', documentController.list);
router.get('/documents/:id/download', documentController.download);

module.exports = router;