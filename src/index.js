const http = require('http');
const { URL } = require('url');

const routes = require('./routes');

const server = http.createServer((request, response) => {

  const parseUrl = new URL(`http://localhot:3000${request.url}`);

  console.log(`Request method: ${request.method} | Endpoint: ${parseUrl.pathname}`);

  const route = routes.find((routeObjt) => (
    routeObjt.endpoint === parseUrl.pathname && routeObjt.method === request.method
  ));

  if(route) {
    request.query = Object.fromEntries(parseUrl.searchParams); //Convertendo o tipo Iterable em Objt JS
    route.handler(request, response);
  } else {
    response.writeHead(404, { 'Context-Type': 'text/html' });
    response.end(`Cannot ${request.method} ${parseUrl.pathname}`);
  }
});

//Ligando o Servidor e deixa-lo executando em uma porta
server.listen(3000, () => console.log(' 🔥 Server started at http://localhost:3000'))