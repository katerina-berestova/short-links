"use strict";

const validUrl = require('valid-url');
const urlModel = require('./model/url');
const config = require('./../config');

const responseCodes = {
    httpOK: 200,
    httpCreated: 201,
    httpBadRequest: 400,
    httpNotFound: 404,
    httpError: 500,
};

function cropLastSlash(str) {
    if (str.substr(-1) === '/')
        return str.substr(0, str.length - 1);
    return str;
};

module.exports = function(app) {
    app.listen(config.port, () => {
        console.log('Server is listening on port 8000');
    });

    app.get('/', (req, res) => {
        res.status(responseCodes.httpOK).send('API is running');
    });

    app.get('/:code', (req, res) => {
        urlModel.getUrlByCode(req.params.code).then((url) => {
            if (!url)
                return res.status(responseCodes.httpNotFound).send('Url for this code haven\'t been found on the server');
            return res.redirect(url);
        }, (reason) => {
            console.log(reason);
            return res.status(responseCodes.httpError).send('Internal error');
        });
    });

    app.post('/', (req, res) => {
        if (req.body !== undefined && req.body.url !== undefined && validUrl.isHttpUri(req.body.url, true)) {
            var url = cropLastSlash(req.body.url);
            urlModel.save(url).then((code) => {
                return res.status(responseCodes.httpCreated).send(config.host + ':' + config.port + '/' + code);
            }, (reason) => {
                console.log(reason);
                return res.status(responseCodes.httpError).send('Internal error');
            });

        } else {
            res.status(responseCodes.httpBadRequest).send('Request is invalid');
        }
    });
};
