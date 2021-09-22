const http = require('http');
const { URL } = require('url');

const bodyParser = require('./helpers/bodyParser');
const routes = require('./routes');

const server = http.createServer((request, response) => {

  const parseUrl = new URL(`http://localhot:3000${request.url}`);

  console.log(`Request method: ${request.method} | Endpoint: ${parseUrl.pathname}`);

  let { pathname } = parseUrl;
  let id = null;

  const splitEndPoint = pathname.split('/').filter(Boolean); //Mark2

  // MARK3 
  if(splitEndPoint.length > 1) {
    pathname = `/${splitEndPoint[0]}/:id`; // [0] = Endpoint
    id = splitEndPoint[1]; // [1] = ID
  }
  
  // MARK4
  const route = routes.find((routeObjt) => (
    routeObjt.endpoint === pathname && routeObjt.method === request.method
  ));

  if(route) {
    request.query = Object.fromEntries(parseUrl.searchParams); //Mark1
    request.params = { id };

    // MARK5
    response.send = (statusCode, body) => {
      response.writeHead(statusCode, { 'Context-Type': 'application/json' });
      response.end(JSON.stringify(body));
    }

    // MARK6
    if(['POST', 'PUT', 'PATCH'].includes(request.method)){
      bodyParser(request, () => route.handler(request, response));
    } else {
      route.handler(request, response);
    }
  } else {
    response.writeHead(404, { 'Context-Type': 'text/html' });
    response.end(`Cannot ${request.method} ${parseUrl.pathname}`);
  }
});

//Ligando o Servidor e deixa-lo executando em uma porta
server.listen(3000, () => console.log(' 🔥 Server started at http://localhost:3000'));

/* Mark1
  Convertendo o tipo Iterable em Objt JS
  Iterable Type -> parseUrl.searchParams
  request.query = Object.fromEntries(parseUrl.searchParams);
  OBS: Injecao de QUERRY PARAMS e ID
*/

/* Mark2 
  Truefy and Falsy do JS -> Caso meu filter retorne algum valor falsy ele nao coloca
    sendo assim '' = falsy nao aparece no console.log
    -> filter((routeItem) => Boolean(routeItem)) <-
*/

/* MARK3
  Split na minha rota para conseguirmos separar oque e 
    Endpoint e o oque e query Param ( no caso o ID ) do User
    e posteriormente injetamos o ID salvo dentro da ROUTES no
    request.params = { id }
 */

/* MARK4
  Identificando o MATCH tanto de endpoint(PATH name), como de metodo(request)
*/

/* MARK5
  Criando um send que consigo reaproveitar em varios lugares do codigo
    evitando escrita repetitiva do writeHead e do End
*/

/* MARK6
  Verificando o metodo HTTP que estamos enviando, e se tiver executamos a funcao
    bodyParser para conseguir pegar o string do Body e transformar em um OBJ Json
    e como ele vai chegando aos poucos, temos que passar uma funcao de CallBack
    no nosso arquivo bodyParser.js

    A Funcao de Callback acaba sendo a funcao dos nossos HANDLERS que definimos
    dentro de nossas rotas.
*/