'use strict';

const {get} = require('lodash');
const assert = require('assert');
const Boom = require('@hapi/boom');

const logger = require('./logger');

exports.logAndThrows = message => {
  logger.logError(message);
  throw new Error(message);
};

module.exports.isNullOrUndefined = function (value) {
  return value === undefined || value === null;
};

/**
 * Assert that a value is neither null nor undefined.
 * @param {*} value
 * @param {String} name name of the missing value
 * @returns {boolean}
 */
module.exports.assertExists = function (value, name) {
  assert(!module.exports.isNullOrUndefined(value), `Missing value: ${name}`);
};

/**
 * Handle errors at route level.
 *
 * @param {Error|*} err
 * @param {Object} request Hapi `request` object
 */
module.exports.handleRouteError = function (err, request) {
  if (err) {
    if (err.isBoom) {
      return (err);
    } else if (err.isOperational && err.statusCode) {
      return (Boom.create(Number(err.statusCode), err.message));
    } else if (get(err, 'request.constructor.name') === 'ClientRequest') {
      // Axios -specific error
      const message = `Error calling external service: [${err.data.statusCode}] ${err.data.message}`;
      return (Boom.badImplementation(message, err));
    } else {
      const message = `Unexpected Error: ${err.message}`;
      logger.logError(message, request);
      return (Boom.badImplementation(message, err));
    }
  } else {
    const message = 'Unexpected Error';
    logger.logError(message, request);
    return (Boom.badImplementation(message));
  }
};
