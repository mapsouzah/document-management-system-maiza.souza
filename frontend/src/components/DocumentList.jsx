import { FileText, FolderOpen } from 'lucide-react';
import DownloadButton from './DownloadButton';

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
const sizeFormatter = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${sizeFormatter.format(bytes / 1024)} KB`;
  return `${sizeFormatter.format(bytes / (1024 * 1024))} MB`;
}

export default function DocumentList({ documents, loading, error, onRetry }) {
  if (loading) return <div className="list-state" role="status">Carregando documentos...</div>;
  if (error) return <div className="list-state" role="alert"><p>{error}</p><button className="text-button" type="button" onClick={onRetry}>Tentar novamente</button></div>;
  if (!documents.length) return <div className="empty-state"><div className="empty-icon"><FolderOpen size={24} /></div><h3>Nenhum documento ainda</h3><p>Os documentos enviados aparecerão aqui.</p></div>;

  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th>Nome do arquivo</th><th>Responsável</th><th>Enviado em</th><th>Tamanho</th><th><span className="visually-hidden">Download</span></th></tr></thead>
        <tbody>
          {documents.map((document) => (
            <tr key={document.id}>
              <td><div className="file-name"><span className="file-icon"><FileText size={17} /></span><span title={document.originalName}>{document.originalName}</span></div></td>
              <td data-label="Responsável">{document.owner}</td>
              <td data-label="Enviado em">{dateFormatter.format(new Date(document.uploadedAt))}</td>
              <td data-label="Tamanho">{formatSize(document.size)}</td>
              <td><DownloadButton document={document} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}