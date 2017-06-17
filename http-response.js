"use strict";

var code;
var data;

const responseCodes = {
  httpOK: 200,
  httpCreated: 201,
  httpRedirect: 302,
  httpBadRequest: 400,
  httpNotFound: 404,
  httpError: 500,
};

module.exports = { responseCodes, Created, Success, Redirect, BadRequest, NotFound, InternalError };

function Success(data) {
  this.code = responseCodes.httpOK;
  if (data) this.data = data;
  else this.data = 'Success';
}

function Created(data) {
  this.code = responseCodes.httpCreated;
  this.data = data;
}

function Redirect(url) {
  this.code = responseCodes.httpRedirect;
  this.data = url;
}

function BadRequest() {
  this.code = responseCodes.httpBadRequest;
  this.data = 'Bad request';
}

function NotFound() {
  this.code = responseCodes.httpNotFound;
  this.data = 'Not found';
}

function InternalError() {
  this.code = responseCodes.httpError;
  this.data = 'Internal server error';
}
