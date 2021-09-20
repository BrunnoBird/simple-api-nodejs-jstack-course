const http = require('http');
const { URL } = require('url');

const routes = require('./routes');

const server = http.createServer((request, response) => {

  const parseUrl = new URL(`http://localhot:3000${request.url}`);

  console.log(`Request method: ${request.method} | Endpoint: ${parseUrl.pathname}`);

  let { pathname } = parseUrl;
  let id = null;

  const splitEndPoint = pathname.split('/').filter(Boolean); //Mark2

  if(splitEndPoint.length > 1) {
    pathname = `/${splitEndPoint[0]}/:id`; // [0] = Endpoint
    id = splitEndPoint[1]; // [1] = ID
  }
  

  const route = routes.find((routeObjt) => (
    routeObjt.endpoint === pathname && routeObjt.method === request.method
  ));

  if(route) {
    request.query = Object.fromEntries(parseUrl.searchParams); //Mark1
    request.params = { id };

    response.send = (statusCode, body) => {
      response.writeHead(statusCode, { 'Context-Type': 'application/json' });
      response.end(JSON.stringify(body));
    }

    route.handler(request, response);
  } else {
    response.writeHead(404, { 'Context-Type': 'text/html' });
    response.end(`Cannot ${request.method} ${parseUrl.pathname}`);
  }
});

//Ligando o Servidor e deixa-lo executando em uma porta
server.listen(3000, () => console.log(' 🔥 Server started at http://localhost:3000'))

/* Mark1
  Convertendo o tipo Iterable em Objt JS
  Iterable Type -> parseUrl.searchParams
  request.query = Object.fromEntries(parseUrl.searchParams);
*/

/* Mark2 
  Truefy and Falsy do JS -> Caso meu filter retorne algum valor falsy ele nao coloca
    sendo assim '' = falsy nao aparece no console.log
    -> filter((routeItem) => Boolean(routeItem)) <-
*/