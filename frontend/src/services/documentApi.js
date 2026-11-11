async function request(path, options) {
  let response;
  try {
    response = await fetch(`/api${path}`, options);
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Tente novamente.');
  }

  if (!response.ok) {
    let message = 'Não foi possível concluir a operação. Tente novamente.';
    try {
      const body = await response.json();
      if (typeof body.error === 'string') message = body.error;
    } catch {}
    throw new Error(message);
  }

  return response;
}

export async function listDocuments() {
  const response = await request('/documents');
  return response.json();
}

export async function uploadDocument(file, owner) {
  const form = new FormData();
  form.append('file', file);
  form.append('owner', owner);
  const response = await request('/upload', { method: 'POST', body: form });
  return response.json();
}

export async function downloadDocument(id) {
  const response = await request(`/documents/${encodeURIComponent(id)}/download`);
  return response.blob();
}