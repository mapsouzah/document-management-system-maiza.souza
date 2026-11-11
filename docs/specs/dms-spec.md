# Especificação - Document Management System

## 1. Objetivo

Entregar uma aplicação web simples para enviar, listar e baixar documentos, com
armazenamento local e metadados associados ao usuário dono de cada documento.

## 2. Escopo

### Dentro do escopo

- Enviar documentos pela interface web.
- Listar documentos e seus metadados.
- Baixar um documento pelo identificador.
- Associar cada documento a um usuário dono.
- Armazenar arquivos no filesystem local da aplicação.

### Fora do escopo

- Armazenamento em nuvem ou uso de provedores externos.
- Versionamento de documentos.
- Persistência de metadados em banco de dados nesta fase.
- Funcionalidades de autenticação ou gestão completa de usuários.

## 3. Requisitos funcionais

| ID    | Requisito |
| ----- | --------- |
| RF-01 | O usuário pode enviar um documento pela interface. |
| RF-02 | O sistema armazena o arquivo enviado em `backend/storage`. |
| RF-03 | O sistema registra os metadados do documento em memória. |
| RF-04 | O usuário pode listar os documentos e consultar seus metadados. |
| RF-05 | O usuário pode baixar um documento pelo identificador. |
| RF-06 | Cada documento mantém a identificação do usuário dono. |
| RF-07 | A interface informa falhas nas operações de envio, listagem ou download. |

## 4. Requisitos não funcionais

| ID     | Requisito |
| ------ | --------- |
| RNF-01 | O backend utiliza Node.js e Express, em CommonJS. |
| RNF-02 | O frontend utiliza React e Vite, em ES modules. |
| RNF-03 | Os uploads usam Multer com `diskStorage` e permanecem no filesystem local. |
| RNF-04 | Os metadados ficam em memória nesta fase inicial. |
| RNF-05 | A configuração do backend, como a porta, é feita por variáveis de ambiente. |
| RNF-06 | O frontend acessa a API via `fetch` usando o prefixo `/api` e o proxy do Vite. |
| RNF-07 | Os testes do backend usam o runner nativo `node:test`. |
| RNF-08 | O código segue a separação de responsabilidades entre routes, controllers, services e repositories. |

## 5. Modelo de dados (metadados do documento)

| Campo        | Tipo   | Descrição |
| ------------ | ------ | --------- |
| id           | string | Identificador único do documento. |
| originalName | string | Nome original do arquivo enviado. |
| size         | number | Tamanho do arquivo em bytes. |
| uploadedAt   | string | Data e hora do upload em formato ISO 8601. |
| owner        | string | Identificador do usuário dono do documento. |

O caminho local do arquivo é usado pelo backend para operações de download e
não precisa ser exposto como metadado público da API.

## 6. Contratos de API

As rotas abaixo são relativas ao backend. O frontend as acessa pelo prefixo
`/api` configurado no proxy do Vite.

### `POST /upload`

- Entrada: arquivo em `multipart/form-data` e informação do usuário dono,
  conforme a implementação.
- Sucesso: metadados do documento criado.
- Erros: resposta HTTP apropriada quando o envio ou o armazenamento falhar.

### `GET /documents`

- Entrada: nenhuma.
- Sucesso: lista de metadados dos documentos disponíveis.
- Erros: resposta HTTP apropriada quando não for possível listar os documentos.

### `GET /documents/:id/download`

- Entrada: identificador do documento no caminho.
- Sucesso: conteúdo binário do arquivo.
- Erros: resposta HTTP `404` quando o documento não existir; demais falhas de
  leitura retornam erro HTTP apropriado.

## 7. Decisões arquiteturais

- Backend organizado em `routes/`, `controllers/`, `services/` e
  `repositories/`, com dependências fluindo nessa ordem.
- Arquivos enviados são gravados localmente em `backend/storage` com Multer e
  `diskStorage`; não são usados serviços externos de armazenamento.
- Metadados são mantidos em memória e podem ser perdidos ao reiniciar o backend.
- Frontend organizado em componentes, páginas e serviços, utilizando Hooks e
  `fetch` para comunicar-se com a API.
- A configuração é fornecida pelo ambiente, sem valores de configuração
  específicos de ambiente embutidos no código.

## 8. Plano de execução

1. Implementar a configuração do backend, o armazenamento local de uploads e o
   repositório em memória para metadados.
2. Implementar serviços, controllers e rotas para upload, listagem e download,
   incluindo tratamento de erros.
3. Adicionar testes backend com `node:test` para os fluxos principais e casos de
   erro.
4. Implementar o serviço frontend de comunicação com a API via `fetch` e
   prefixo `/api`.
5. Construir a interface com componentes para upload, listagem e download, com
   feedback de erros e estados de carregamento.
6. Validar o fluxo completo de ponta a ponta e documentar como executar a
   aplicação.
