const http = require('http');
const Cookies = require('cookies');

require('./boot').then(function () {
  const router = sys.get('core/Router');

  const server = http.createServer((request, response) => {
    const config = sys.get('core/Config').get('system', true);

    if (config.maintenance) {
      response.writeHead(503, {
        'Content-Type': 'text/plain',
      });
      response.write('maintenance mode');
      response.end();
      return;
    }

    const cookies = new Cookies(request, response);
    const routed = router.route(request.url);

    const data = {
      Controller: null,
      method: null,
      params: {},
      cookies: cookies,
      request: request,
      response: response,
      routed: routed,
    };

    if (routed) {
      data.Controller = require(routed.handler.controller);
      data.method = routed.handler.method;
      data.params = routed.params;
      sys
        .trigger('system.router.found', data)
        .then(doResponse);
    } else {
      sys
        .trigger('system.router.notFound', data)
        .then(doResponse);
    }
  });

  function doResponse(data) {
    const controller = new data.Controller(data);

    controller._execute(data);
  }

  server.listen(sys.config('server.port'));
  console.log('started on port', sys.config('server.port'));
});
