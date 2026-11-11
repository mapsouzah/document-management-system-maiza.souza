import { useRef, useState } from 'react';
import { ArrowUpRight, FileUp, LoaderCircle } from 'lucide-react';
import { uploadDocument } from '../services/documentApi';

export default function UploadComponent({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [owner, setOwner] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInput = useRef(null);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!file || !owner.trim()) {
      setError('Selecione um arquivo e informe o responsável.');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');
    try {
      await uploadDocument(file, owner.trim());
      setFile(null);
      fileInput.current.value = '';
      setSuccess('Documento enviado com sucesso.');
      await onUploaded();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <form className="upload-form" onSubmit={handleSubmit}>
      <label className="field-label" htmlFor="document-file">Arquivo</label>
      <label className="file-picker" htmlFor="document-file">
        <FileUp size={21} aria-hidden="true" />
        <span className="file-picker-copy"><strong>{file ? file.name : 'Selecionar arquivo'}</strong><small>{file ? 'Arquivo selecionado' : 'Nenhum arquivo selecionado'}</small></span>
        <ArrowUpRight size={16} aria-hidden="true" />
      </label>
      <input ref={fileInput} className="visually-hidden" id="document-file" type="file" onChange={(event) => setFile(event.target.files[0] || null)} disabled={uploading} required />

      <label className="field-label owner-label" htmlFor="document-owner">Responsável</label>
      <input className="text-input" id="document-owner" type="text" placeholder="Nome do responsável" value={owner} onChange={(event) => setOwner(event.target.value)} disabled={uploading} required />

      {error && <p className="feedback error" role="alert">{error}</p>}
      {success && <p className="feedback success" role="status">{success}</p>}
      <button className="primary-button" type="submit" disabled={uploading}>
        {uploading ? <LoaderCircle className="spin" size={17} /> : <FileUp size={17} />}
        {uploading ? 'Enviando...' : 'Enviar documento'}
        {!uploading && <ArrowUpRight className="button-arrow" size={17} />}
      </button>
    </form>
  );
}