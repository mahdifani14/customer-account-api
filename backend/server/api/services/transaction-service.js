'use strict';

const utils = require('../../utils');
const TransactionDao = require('../dao/transaction-dao');
const Transaction = require('../models/transaction-model');
const transactionDao = new TransactionDao();

exports.createTransaction = (doc) => {
  const transaction = Transaction.fromDocument(doc);

  return transactionDao.createTransaction(transaction);
};

exports.getTransactionsByCustomerId = (customerId) => {
  utils.assertExists(customerId, 'customerId');

  return transactionDao.findTransactions(customerId);
};
