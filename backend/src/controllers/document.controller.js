const { unlink } = require('node:fs/promises');
const documentService = require('../services/document.service');

async function upload(req, res, next) {
  if (!req.file) {
    return res.status(400).json({ error: 'Envie um arquivo no campo file.' });
  }

  if (typeof req.body.owner !== 'string' || !req.body.owner.trim()) {
    await unlink(req.file.path);
    return res.status(400).json({ error: 'Informe o dono do documento no campo owner.' });
  }

  try {
    const document = documentService.create(req.file, req.body.owner.trim());
    return res.status(201).json(document);
  } catch (error) {
    await unlink(req.file.path);
    return next(error);
  }
}

function list(req, res) {
  res.json(documentService.list());
}

function download(req, res, next) {
  const document = documentService.findById(req.params.id);
  if (!document) {
    return res.status(404).json({ error: 'Documento não encontrado.' });
  }

  return res.download(document.path, document.originalName, (error) => {
    if (!error) {
      return;
    }
    if (res.headersSent) {
      return next(error);
    }
    if (error.code === 'ENOENT') {
      return res.status(404).json({ error: 'Arquivo não encontrado.' });
    }
    return next(error);
  });
}

module.exports = { upload, list, download };