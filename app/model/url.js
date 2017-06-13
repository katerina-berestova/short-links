"use strict";

const config = require('../../config');
const mysql = require('mysql');
const sha1 = require('sha1');

const connection = mysql.createConnection({
    'host': config.db.host,
    'user': config.db.user,
    'password' : config.db.password,
    'database' : config.db.dbname
});

connection.connect((err) => {
    if (err)
        return console.error('error connecting: ' + err.stack);
    return console.log('connected as id ' + connection.threadId);
});

function getRandomInt(min, max) {
    return Math.random() * (max - min) + min;
};

function insertRow(url, code) {
    return new Promise((resolve, reject) => {
        var row = {
            'url': url,
            'code': code
        };
        connection.query('INSERT INTO link SET ?', row, (error, results) => {
            if (error) return reject(error);
            return resolve(row);
        });
    });
};

function getRowByUrl(url) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT code FROM link WHERE `url` = ?', url , (error, results) => {
            if (error) return reject(error);
            if (results[0] !== undefined)
                return resolve(results[0]);
            return resolve(null);
        });
    });
};

function getRowByCode(code) {

    return new Promise((resolve, reject) => {
        connection.query('SELECT url FROM link WHERE `code` = ?', code, (error, results) => {
            if (error) return reject(error);
            if (results[0] !== undefined)
                return resolve(results[0]);
            return resolve(null);
        });
    });
};

function generateUniqueCode() {

    return new Promise((resolve, reject) => {
        function generate() {
            const length = 6;
            var hash = sha1(new Date().getTime());
            var start = getRandomInt(0, 34);
            var code = hash.substring(start, start+length).toUpperCase();
            getRowByCode(code).then((result) => {
                if (result !== null) generate();
                return resolve(code);

            }).catch((error) => {
                return reject(error);
            });
        }
        generate();
    });
};

module.exports = {
    save: function (url) {
        return new Promise((resolve, reject) => {
            getRowByUrl(url).then((row) => {
                if (!row) {
                    generateUniqueCode().then((code) => {
                        return insertRow(url, code);
                    }).then((row) => {
                        return resolve(row.code);
                    });
                } else
                    return resolve(row.code);
            }).catch(function (error) {
                return reject(error);
            });
        });
    },

    getUrlByCode: function(code) {
        return new Promise((resolve, reject) => {
            getRowByCode(code).then((row) => {
                if (!row)
                    return resolve(null);
                else
                    return resolve(row.url);
            }).catch((error) => {
                return reject(error);
            });
        });
    }
};
