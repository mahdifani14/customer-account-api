'use strict';

const Transaction = require('../models/transaction-model');
const TransactionDao = require('../dao/transaction-dao');
const transactionDao = new TransactionDao();

exports.createTransaction = (doc) => {
  const transaction = Transaction.fromDocument(doc);

  return transactionDao.createTransaction(transaction);
};
