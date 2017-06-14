"use strict";

const config = require('../../config');
const mysql = require('mysql');
const sha1 = require('sha1');

const {host, user, database, password} = config.db;
const connection = mysql.createConnection({ host, user, database, password });

connection.connect(err => {
    if (err)
        return console.error('error connecting: ' + err.stack);
    return console.log('connected as id ' + connection.threadId);
});

function getRandomInt(min, max) {
    return Math.random() * (max - min) + min;
};

function insertRow(url, code) {
    return new Promise((resolve, reject) => {
        const row = { url, code };
        connection.query('INSERT INTO link SET ?', row, (error, results) => {
            if (error) return reject(error);
            resolve(row);
        });
    });
};

function getRowByUrl(url) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT code FROM link WHERE `url` = ?', url , (error, results) => {
            if (error) return reject(error);
            resolve(results[0]);
        });
    });
};

function getRowByCode(code) {

    return new Promise((resolve, reject) => {
        connection.query('SELECT url FROM link WHERE `code` = ?', code, (error, results) => {
            if (error) return reject(error);
            resolve(results[0]);
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
            getRowByCode(code).then(result => {
                if (!result) generate();
                resolve(code);

            }).catch(error => reject(error));
        }
        generate();
    });
};

function save(url) {
    return new Promise((resolve, reject) => {
        getRowByUrl(url).then(row => {
            if (!row) {
                generateUniqueCode().then(code => {
                    return insertRow(url, code)
                }).then(row => resolve(row.code));
            } else
                resolve(row.code);
        }).catch(error => reject(error));
    });
};

function getUrlByCode(code) {
    return new Promise((resolve, reject) => {
        getRowByCode(code).then(row => {
            if (!row)
                resolve(null);
            else
                resolve(row.url);
        }).catch(error => reject(error));
    });
};

module.exports = { save, getUrlByCode };
