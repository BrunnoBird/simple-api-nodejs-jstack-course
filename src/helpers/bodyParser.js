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