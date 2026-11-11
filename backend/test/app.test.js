const { test } = require('node:test');
const assert = require('node:assert/strict');
const { unlink } = require('node:fs/promises');
const { once } = require('node:events');
const app = require('../src/app');
const documentRepository = require('../src/repositories/document.repository');

test('o app backend é exportado', () => {
  assert.ok(app, 'o app deve estar definido');
  assert.strictEqual(typeof app, 'function', 'o app Express deve ser uma função');
});

test('fluxo de documentos e erros de entrada', async (context) => {
  const server = app.listen(0);
  await once(server, 'listening');
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  let document;

  context.after(async () => {
    if (document) {
      await unlink(documentRepository.findById(document.id).path).catch((error) => {
        if (error.code !== 'ENOENT') throw error;
      });
    }
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  });

  const form = new FormData();
  form.append('file', new Blob(['conteúdo do documento']), 'documento.txt');
  form.append('owner', '  usuario  ');
  const uploadResponse = await fetch(`${baseUrl}/upload`, { method: 'POST', body: form });
  assert.equal(uploadResponse.status, 201);
  document = await uploadResponse.json();
  assert.equal(document.originalName, 'documento.txt');
  assert.equal(document.owner, 'usuario');
  assert.equal(document.size, Buffer.byteLength('conteúdo do documento'));
  assert.ok(document.id);
  assert.ok(!Number.isNaN(Date.parse(document.uploadedAt)));
  assert.deepEqual(Object.keys(document).sort(), ['id', 'originalName', 'owner', 'size', 'uploadedAt']);

  const listResponse = await fetch(`${baseUrl}/documents`);
  assert.equal(listResponse.status, 200);
  assert.deepEqual(await listResponse.json(), [document]);

  const downloadResponse = await fetch(`${baseUrl}/documents/${document.id}/download`);
  assert.equal(downloadResponse.status, 200);
  assert.match(downloadResponse.headers.get('content-disposition'), /documento\.txt/);
  assert.equal(await downloadResponse.text(), 'conteúdo do documento');

  const missingResponse = await fetch(`${baseUrl}/documents/inexistente/download`);
  assert.equal(missingResponse.status, 404);

  const noFile = new FormData();
  noFile.append('owner', 'usuario');
  assert.equal((await fetch(`${baseUrl}/upload`, { method: 'POST', body: noFile })).status, 400);

  const noOwner = new FormData();
  noOwner.append('file', new Blob(['teste']), 'sem-dono.txt');
  assert.equal((await fetch(`${baseUrl}/upload`, { method: 'POST', body: noOwner })).status, 400);

  const wrongField = new FormData();
  wrongField.append('arquivo', new Blob(['teste']), 'arquivo.txt');
  assert.equal((await fetch(`${baseUrl}/upload`, { method: 'POST', body: wrongField })).status, 400);

  await unlink(documentRepository.findById(document.id).path);
  assert.equal((await fetch(`${baseUrl}/documents/${document.id}/download`)).status, 404);
});
