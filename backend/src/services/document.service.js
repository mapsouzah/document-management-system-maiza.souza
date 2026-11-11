const { randomUUID } = require('node:crypto');
const documentRepository = require('../repositories/document.repository');

function publicMetadata(document) {
  const { id, originalName, size, uploadedAt, owner } = document;
  return { id, originalName, size, uploadedAt, owner };
}

function createMetadata(file, owner) {
  return {
    id: randomUUID(),
    originalName: file.originalname,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    owner,
  };
}

function create(file, owner) {
  const metadata = createMetadata(file, owner);
  documentRepository.save({ ...metadata, path: file.path });
  return metadata;
}

function list() {
  return documentRepository.findAll().map(publicMetadata);
}

function findById(id) {
  return documentRepository.findById(id);
}

module.exports = { create, list, findById };