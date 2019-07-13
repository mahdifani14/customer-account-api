'use strict';

const {omit} = require('lodash');
const Boom = require('@hapi/boom');

const utils = require('../../utils');
const AccountDao = require('../dao/account-dao');
const CustomerDao = require('../dao/customer-dao');
const Account = require('../models/account-model');
const transactionService = require('./transaction-service');

const accountDao = new AccountDao();
const customerDao = new CustomerDao();

exports.createAccount = ({customerId, initCredit, currency}) => {
  const account = Account.fromDocument({
    customerId,
    currency,
    value: initCredit,
  });

  return customerDao.findCustomer(customerId)
    .then((customerInfo) => {
      if (!customerInfo) {
        const msg = 'Customer not found';
        throw Boom.notFound(msg, {customerId});
      }

      return accountDao.createAccount(account);
    })
    .then(() => {
      if (initCredit > 0) {
        transactionService.createTransaction({
          accountId: account.id,
          customerId,
          amount: initCredit,
          currency,
          action: 'INC'
        });
      }
    })
    .then(() => omit(account, ['_id', 'createdAt']));
};

exports.getAccountsByCustomerId = (customerId) => {
  utils.assertExists(customerId, 'customerId');

  return accountDao.findAccounts(customerId);
};