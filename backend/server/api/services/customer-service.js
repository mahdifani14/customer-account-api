'use strict';

const {omit} = require('lodash');
const Boom = require('@hapi/boom');
const Promise = require('bluebird');

const CustomerDao = require('../dao/customer-dao');
const accountService = require('./account-service');
const transactionService = require('./transaction-service');

const customerDao = new CustomerDao();

function _getBalance(accounts) {
  if (!Array.isArray(accounts) || accounts.length < 1) {
    return 0;
  }

  return accounts.reduce(((acc, cur) => acc + cur.deposit.value), 0);
}

exports.getCustomerProfile = (customerId) => {
  return Promise.resolve()
    .bind({})
    .then(function () {
      return customerDao.findCustomer(customerId);
    })
    .then(function (customerInfo) {
      if (!customerInfo) {
        const msg = 'Customer not found';
        throw Boom.notFound(msg, {customerId});
      }

      this.customerInfo = omit(customerInfo, ['_id']);
      return accountService.getAccountsByCustomerId(customerId);
    })
    .then(function (accountsInfo) {
      this.accountsInfo = accountsInfo;
      this.balance = _getBalance(accountsInfo.accounts);

      return transactionService.getTransactionsByCustomerId(customerId);
    })
    .then(function (transactionsInfo) {
      this.transactionsInfo = transactionsInfo;
      return this;
    });
};
