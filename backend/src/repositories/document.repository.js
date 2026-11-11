const documents = new Map();

function save(document) {
  documents.set(document.id, document);
}

function findAll() {
  return Array.from(documents.values());
}

function findById(id) {
  return documents.get(id);
}

module.exports = { save, findAll, findById };