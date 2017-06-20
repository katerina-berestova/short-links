/**
 * Module that persists and retrieves data from the database
 */
"use strict";

const mysql = require('mysql');
const codegenerator = require('../helper/codegenerator');
const config = require('../../config');
const { host, user, database, password } = config.db;

const connection = mysql.createConnection({ host, user, database, password });

module.exports = { save, getUrlByCode };

connection.connect(err => {
  if (err)
    return debug('error connecting: ' + err.stack);
  console.log('connected as id ' + connection.threadId);
});

function insert(url, code) {
  return new Promise((resolve, reject) => {
    const row = { url, code };

    connection.query('INSERT INTO `link` SET ?', row, error => {
      if (error) return reject(error);
      resolve(row);
    });
  });
}

function get(params) {
  return new Promise((resolve, reject) => {
    const { select, from, where } = params;
    const field = Object.keys(where);
    const value = where[field];

    const sql = `SELECT ${select} FROM ${from} WHERE ${field} = ?`;

    connection.query(sql, `${value}`, (error, results) => {
      if (error) return reject(error);
      resolve(results[0]);
    });
  });
}

function createCode() {
  return new Promise((resolve, reject) => {
    function generate() {
      const code = codegenerator.create();
      get({ select: 'url', from: 'link', where: { code } }).then(result => {
        if (result) return generate();
        resolve(code);
      }).catch(reject);
    }
    generate();
  });
}

function save(url) {
  return new Promise((resolve, reject) => {
    const options = { select: 'code', from: 'link', where: { url } };

    get(options).then(row => {
      if (row) return resolve(row.code);

      createCode()
        .then(code => insert(url, code))
        .then(row => resolve(row.code));
    }).catch(reject);
  });
}

function getUrlByCode(code) {
  return new Promise((resolve, reject) => {
    const options = { select: 'url', from: 'link', where: { code } };

    get(options)
      .then(row => resolve(row && row.url))
      .catch(reject);
  });
}
