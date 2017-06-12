"use strict";

var validUrl = require('valid-url');
var urlModel = require('./model/url');
var config = require('./../config');

var responseCodes = {
    httpOK: 200,
    httpCreated: 201,
    httpBadRequest: 400,
    httpNotFound: 404,
    httpError: 500,
};

function cropLastSlash(str) {
    if(str.substr(-1) === '/') {
        return str.substr(0, str.length - 1);
    }
    return str;
};

module.exports = function(app) {
    app.listen(config.port, function(){
        console.log('Server is listening on port 8000');
    });

    app.get('/', function (req, res) {
        res.status(responseCodes.httpOK).send('API is running');
    });

    app.get('/:code', function (req, res) {
        urlModel.getUrlByCode(req.params.code).then(function (url) {
            if (!url) {
                res.status(responseCodes.httpNotFound).send('Url for this code haven\'t been found on the server');
                return;
            }
            res.redirect(url);
            return;
        }, function (reason) {
            console.log(reason);
            res.status(responseCodes.httpError).send('Internal error');
            return;
        });
    });

    app.post('/', function(req, res) {
        if (req.body !== undefined && req.body.url !== undefined && validUrl.isHttpUri(req.body.url, true)) {
            var url = cropLastSlash(req.body.url);
            urlModel.save(url).then(function (code) {
                res.status(responseCodes.httpCreated).send(config.host + '/' + code);
                return;
            }, function (reason) {
                res.status(responseCodes.httpError).send('Internal error');
                return;
            });

        } else {
            res.status(responseCodes.httpBadRequest).send('Request is invalid');
        }
    });
};