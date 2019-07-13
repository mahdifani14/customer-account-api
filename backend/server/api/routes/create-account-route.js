'use strict';

const Joi = require('joi');

const utils = require('../../utils');
const constants = require('../../constants');
const Account = require('../models/account-model');
const accountService = require('../services/account-service');

const validate = {
  headers: Joi.object({'authorization': Joi.string().required()}).unknown(),
  payload: {
    initCredit: Joi.number().min(0).required(),
    customerId: Joi.string().guid({version: ['uuidv4']}).required(),
    currency: Joi.string().valid('EUR').required()
  }
};

function handler(request) {
  return accountService.createAccount(request.payload)
    .then(result => {
      return result;
    })
    .catch(err => {
      console.log(err);
      return utils.handleRouteError(err, request);
    });
}

module.exports = {
  method: 'POST',
  path: '/create-account',
  options: {
    cors: true,
    description: 'Create account for existing customers',
    validate: validate,
    handler: handler,
    auth: {
      strategy: 'jwt',
      scope: [
        constants.USER_TYPE.USER
      ]
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Success',
            schema: Account.schema()
          },
          '400': {description: 'Bad Request'},
          '401': {description: 'Unauthorized'},
          '404': {description: 'Customer not found'},
          '500': {description: 'Unexpected server error'}
        }
      }
    },
    tags: ['api', 'account']
  }
};
