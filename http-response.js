"use strict";

const responseCodes = {
  httpOK: 200,
  httpCreated: 201,
  httpBadRequest: 400,
  httpNotFound: 404,
  httpError: 500,
};

module.exports = { Created, Success, BadRequest, NotFound, InternalError };

function Success(data) {
  this.code = responseCodes.httpOK;
  this.data = data || 'Success';
}

function Created(data) {
  this.code = responseCodes.httpCreated;
  this.data = data || 'Created';
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
