/**
 * Module which generates random code of defined length for url
 */
"use strict";

const sha1 = require('sha1');
const length = 6;

module.exports = { create };

function getRandomInt(min, max) {
  return Math.random() * (max - min) + min;
}

function create() {
  const hash = sha1(new Date().getTime());
  const start = getRandomInt(0, 34);
  return hash.substring(start, start + length).toUpperCase();
}
