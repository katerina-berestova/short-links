"use strict";

const config = require('../../config');
const mysql = require('mysql');
const {host, user, database, password} = config.db;
const codegenerator = require('../helper/codegenerator');
const connection = mysql.createConnection({ host, user, database, password });

module.exports = { save, getUrlByCode };

connection.connect(err => {
  if (err)
    return console.error('error connecting: ' + err.stack);
  return console.debug('connected as id ' + connection.threadId);
});

function insertRow(url, code) {
  return new Promise((resolve, reject) => {
    const row = { url, code };
    connection.query('INSERT INTO `link` SET ?', row, (error, results) => {
      if (error) return reject(error);
      resolve(row);
    });
  });
}

function getRow(params) {
    return new Promise((resolve, reject) => {
        var field = Object.keys(params.where)[0],
            value = params.where[field];
        var sql = `SELECT ${params.select} FROM ${params.from} WHERE ${field} = ?`;
        connection.query(sql, `${value}`, (error, results) => {
            if (error) return reject(error);
            resolve(results[0]);
        });
    });
}

function createCode() {
  return new Promise((resolve, reject) => {
    function generate() {
      var code = codegenerator.generateRandomCode();
      getRow({ select: 'url', from: 'link', where: { code: code } }).then(result => {
        if (!result) generate();
        resolve(code);
      }).catch(error => reject(error));
    }
    generate();
  });
}

function save(url) {
  return new Promise((resolve, reject) => {
    getRow({ select: 'code', from: 'link', where: { url: url } }).then(row => {
      if (!row) {
        createCode().then(code => {
          return insertRow(url, code)
        }).then(row => resolve(row.code));
      } else
      resolve(row.code);
    }).catch(error => reject(error));
  });
}

function getUrlByCode(code) {
  return new Promise((resolve, reject) => {
    getRow({ select: 'url', from: 'link', where: { code: code } }).then(row => {
    if (!row)
      resolve(null);
    else
      resolve(row.url);
    }).catch(error => reject(error));
  });
}
