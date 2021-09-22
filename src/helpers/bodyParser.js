function bodyParser(request, callback) {
    let body = '';

    // event listener
    request.on('data', (chunk) => {
      body += chunk;
    });

    // quando finalizar de chegar meu chunk
    request.on('end', () => {
      body = JSON.parse(body);
      // injetar dentro do request
      request.body = body;
      callback();
    });
  }

module.exports = bodyParser;

/* MARK1
 Fica ouvindo as mensagens ( sempre que chega um evento com data "partezinha do body")
  vamos concatenando ele dentro de uma let Body
  e quando chegar a ultima menssagem chamamos o metodo 'END' transformamos o nosso BODY
  e um OBJ Json
  passamos o OBJ transformado dentro de request.body e chamamos o nosso callback()
  que passamos quando executamos a funcao bodyParsers
*/