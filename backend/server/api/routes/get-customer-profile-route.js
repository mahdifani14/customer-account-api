'use strict';

const Joi = require('joi');

const utils = require('../../utils');
const constants = require('../../constants');
const Account = require('../models/account-model');
const Customer = require('../models/customer-model');
const Transaction = require('../models/transaction-model');
const customerService = require('../services/customer-service');

const validate = {
  headers: Joi.object({'authorization': Joi.string().required()}).unknown(),
  params: {
    customerId: Joi.string().guid({version: ['uuidv4']}).required()
  }
};

function handler(request) {
  return Promise.resolve()
    .then(function () {
      return customerService.getCustomerProfile(request.params.customerId);
    })
    .then(result => {
      return result;
    })
    .catch(err => {
      console.log(err);
      utils.handleRouteError(err, request);
    });
}

module.exports = {
  method: 'GET',
  path: '/get-customer-profile/{customerId}',
  options: {
    cors: true,
    description: 'Get customer information',
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
            schema: Joi.object({
              customerInfo: Customer.schema(),
              accountsInfo: Joi.object({
                accounts: Joi.array().items(Account.schema()),
                total: Joi.number()
              }),
              transactionsInfo: Joi.object({
                transactions: Joi.array().items(Transaction.schema()),
                total: Joi.number()
              })
            })
          },
          '400': {description: 'Bad Request'},
          '401': {description: 'Unauthorized'},
          '404': {description: 'Customer not found'},
          '500': {description: 'Unexpected server error'}
        }
      }
    },
    tags: ['api', 'customer']
  }
};
