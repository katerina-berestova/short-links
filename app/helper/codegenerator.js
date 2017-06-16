"use strict";

const sha1 = require('sha1');

module.exports = { generateRandomCode };

function getRandomInt(min, max) {
    return Math.random() * (max - min) + min;
}

function generateRandomCode() {
    const length = 6;
    var hash = sha1(new Date().getTime());
    var start = getRandomInt(0, 34);
    return hash.substring(start, start + length).toUpperCase();
}
