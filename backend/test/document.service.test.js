const { test } = require('node:test');
const assert = require('node:assert/strict');
const documentService = require('../src/services/document.service');
const documentRepository = require('../src/repositories/document.repository');

test('create grava o caminho interno sem expô-lo nos metadados', (context) => {
  const save = context.mock.method(documentRepository, 'save', () => {});
  const file = { originalname: 'documento.txt', size: 12, path: '/storage/arquivo' };

  const metadata = documentService.create(file, 'usuario');

  assert.deepEqual(Object.keys(metadata).sort(), ['id', 'originalName', 'owner', 'size', 'uploadedAt']);
  assert.equal(metadata.originalName, file.originalname);
  assert.equal(metadata.size, file.size);
  assert.equal(metadata.owner, 'usuario');
  assert.ok(metadata.id);
  assert.ok(!Number.isNaN(Date.parse(metadata.uploadedAt)));
  assert.equal(save.mock.callCount(), 1);
  assert.deepEqual(save.mock.calls[0].arguments[0], { ...metadata, path: file.path });
});

test('list expõe apenas metadados e findById preserva o caminho interno', (context) => {
  const document = {
    id: 'documento-1',
    originalName: 'documento.txt',
    size: 12,
    uploadedAt: '2026-01-01T00:00:00.000Z',
    owner: 'usuario',
    path: '/storage/arquivo',
    internalField: 'privado',
  };
  context.mock.method(documentRepository, 'findAll', () => [document]);
  context.mock.method(documentRepository, 'findById', (id) => id === document.id ? document : undefined);

  assert.deepEqual(documentService.list(), [{
    id: document.id,
    originalName: document.originalName,
    size: document.size,
    uploadedAt: document.uploadedAt,
    owner: document.owner,
  }]);
  assert.equal(documentService.findById(document.id), document);
  assert.equal(documentService.findById('inexistente'), undefined);
});