"use strict";

var urlModel = require('./model/url');
var config = require('./../config');

var responseCodes = {
    httpOK: 200,
    httpCreated: 201,
    httpBadRequest: 400,
    httpError: 500,
};


module.exports = function(app) {
    app.listen(config.port, function(){
        console.log('Server is listening on port 8000');
    });

    app.get('/', function (req, res) {
        res.status(responseCodes.httpOK).send('API is running');
    });

    app.post('/', function(req, res) {
        if (req.body !== undefined && req.body.url !== undefined) {
            urlModel.save(req.body.url).then(function (code) {
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
