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
  this.data = data || 'Success';
}

function Created(data) {
  this.code = responseCodes.httpCreated;
  this.data = data || 'Created';
}

function Redirect(url) {
  this.code = responseCodes.httpRedirect;
  this.data = url;
}

function BadRequest(data) {
  this.code = responseCodes.httpBadRequest;
  this.data = data || 'Bad request';
}

function NotFound(data) {
  this.code = responseCodes.httpNotFound;
  this.data = data || 'Not found';
}

function InternalError(data) {
  this.code = responseCodes.httpError;
  this.data = data || 'Internal server error';
}
