const { randomUUID } = require('node:crypto');
const documentRepository = require('../repositories/document.repository');

function publicMetadata(document) {
  const { id, originalName, size, uploadedAt, owner } = document;
  return { id, originalName, size, uploadedAt, owner };
}

function create(file, owner) {
  const document = {
    id: randomUUID(),
    originalName: file.originalname,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    owner,
    path: file.path,
  };
  documentRepository.save(document);
  return publicMetadata(document);
}

function list() {
  return documentRepository.findAll().map(publicMetadata);
}

function findById(id) {
  return documentRepository.findById(id);
}

module.exports = { create, list, findById };