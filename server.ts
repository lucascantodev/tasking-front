// Usamos json-server para criar rapidamente uma API REST sem backend real
// Ideal para prototipação e desenvolvimento front-end independente
import jsonServer from 'json-server';

// CORS é necessário para evitar bloqueios de segurança no navegador
// quando o frontend (porta 3000) acessa nossa API (porta 3001)
import cors from 'cors';

// Criamos um servidor Express customizável em vez de usar o CLI padrão
// para termos controle sobre middlewares e comportamentos
const server = jsonServer.create();

// Vinculamos o arquivo db.json ao router para persistência de dados
// permitindo que as alterações via API sejam salvas no arquivo
const router = jsonServer.router('db.json');

// Incluímos funcionalidades essenciais como log, CORS básico e parsing de JSON
// sem precisar configurar cada um manualmente
const middlewares = jsonServer.defaults();

// Ativamos CORS com configuração personalizada para maior controle
// sobrescrevendo as configurações básicas do middlewares.defaults()
server.use(cors());

// Adicionamos recursos padrão antes das rotas para garantir
// que todas as requisições sejam processadas corretamente
server.use(middlewares);

// Registramos todas as rotas automáticas APÓS os middlewares
// para que toda a lógica de pré-processamento seja aplicada
server.use(router);

// Usamos porta 3001 para evitar conflito com o Next.js (3000)
// facilitando o desenvolvimento paralelo de front e back
server.listen(3001, () => {
  console.log('JSON Server is running on port 3001');
});
