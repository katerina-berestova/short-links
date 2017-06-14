"use strict";

const validUrl = require('valid-url');
const urlModel = require('./model/url');
const config = require('./../config');
const { host, port } = config;

const responseCodes = {
  httpOK: 200,
  httpCreated: 201,
  httpBadRequest: 400,
  httpNotFound: 404,
  httpError: 500,
};

function cropLastSlash(str) {
  return str.slice(-1) === '/' ? str.slice(0, -1) : str;
};

module.exports = function(app) {
  app.listen(port, () => console.log('Server is listening on port  ${port}'));

  app.get('/', (req, res) => {
    res.status(responseCodes.httpOK).send('API is running');
  });

  app.get('/:code', (req, res) => {
    urlModel.getUrlByCode(req.params.code).then(url => {
      if (url) return res.redirect(url);
        res.status(responseCodes.httpNotFound).send('Url for this code haven\'t been found on the server');
    }, reason => {
      console.log(reason);
      return res.status(responseCodes.httpError).send('Internal server error');
    });
  });

  app.post('/', (req, res) => {
    var url = req.body && req.body.url;
    if (!validUrl.isHttpUri(req.body.url, true)) {
      res.status(responseCodes.httpBadRequest).send('Request is invalid');
    }
    var url = cropLastSlash(url);
    urlModel.save(url).then(
      code => res.status(responseCodes.httpCreated).send(`${host}:${port}/${code}`),
      reason => {
        console.log(reason);
        res.status(responseCodes.httpError).send('Internal server error');
      }
    );
  });
};
