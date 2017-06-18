"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const validUrl = require('valid-url');
const debug = require('debug');
const urlModel = require('./app/model/url');
const httpResponse = require('./http-response');
const config = require('./config');
const { host, port } = config;
const app = express();

app.use(bodyParser.json());

app.listen(port, () => console.log(`Server is listening on port  ${port}`));

app.get('/', (req, res) => {
  return respond(new httpResponse.Success('API is running'), res);
});

app.get('/:code', (req, res) => {
  urlModel.getUrlByCode(req.params.code).then(url => {

    if (url)
      return res.redirect(url);

    respond(new httpResponse.NotFound(), res);
  }, reason => {
    debug(reason);

    respond(new httpResponse.InternalError(), res);
  });
});

app.post('/', (req, res) => {
  var url = req.body && req.body.url;

  if (!validUrl.isHttpUri(url, true))
    return respond(new httpResponse.BadRequest(), res);

  url = cropLastSlash(url);

  urlModel.save(url).then(
    code => respond(new httpResponse.Created(`${host}:${port}/${code}`), res),
    reason => {
      debug(reason);
      respond(new httpResponse.InternalError(), res);
    }
  );
});

function respond(result, response) {
  const { code, data } = result;
  response.status(code).send(data);
}

function cropLastSlash(str) {
  return str.slice(-1) === '/' ? str.slice(0, -1) : str;
}
