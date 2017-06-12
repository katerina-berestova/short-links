"use strict";

var config = require('../../config');
var mysql = require('mysql');
var sha1 = require('sha1');

var connection = mysql.createConnection({
    'host': config.db.host,
    'user': config.db.user,
    'password' : config.db.password,
    'database' : config.db.dbname
});

connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});

function getRandomInt(min, max) {
    return Math.random() * (max - min) + min;
};

function insertRow(url, code) {

    console.log(url, mysql.escape(url));

    return new Promise(function(resolve, reject) {
        var row = {
            'url': url,
            'code': code
        };
        var query = connection.query('INSERT INTO link SET ?', row, function (error, results) {
            if (error) {
                reject(error)
            };
            resolve(row);
        });
    });
};

function getRowByUrl(url) {
    return new Promise(function(resolve, reject) {
        var query = connection.query('SELECT code FROM link WHERE `url` = ?', url , function (error, results) {
            if (error) {
                reject(error);
                return;
            }
            if (results[0] !== undefined) {
                resolve(results[0]);
                return;
            }
            resolve(null);
            return;
        });
    });
};

function getRowByCode(code) {

    return new Promise(function(resolve, reject) {
        var query = connection.query('SELECT url FROM link WHERE `code` = ?', code, function (error, results) {
            if (error) {
                reject(error);
                return;
            }
            if (results[0] !== undefined) {
                resolve(results[0]);
                return;
            }
            resolve(null);
            return;

        });
    });
};

function generateUniqueCode() {

    return new Promise(function(resolve, reject) {
        function generate() {
            var length = 6;
            var hash = sha1(new Date().getTime());
            var start = getRandomInt(0, 34);
            var code = hash.substring(start, start+length).toUpperCase();

            getRowByCode(code).then(function(result) {
                if (result !== null) {
                    generate();
                }
                resolve(code);
                return;
            }).catch(function (error) {
                reject(error);
                return;
            })
        }
        generate();
    });
};

module.exports = {
    save: function (url) {
        return new Promise(function(resolve, reject) {
            getRowByUrl(url).then(function (row) {
                if (!row) {
                    generateUniqueCode().then(function (code) {
                        return insertRow(url, code);
                    }).then(function (row) {
                        resolve(row.code);
                        return;
                    });
                } else {
                    resolve(row.code);
                    return;
                }
            }).catch(function (error) {
                reject(error);
                return;
            });
        });
    },

    getUrlByCode: function(code) {
        return new Promise(function(resolve, reject) {
            getRowByCode(code).then(function (row) {
                if (!row) {
                    resolve(null);
                    return;
                } else {
                    resolve(row.url);
                    return;
                }
            }).catch(function (error) {
                reject(error);
                return;
            });
        });
    }
};