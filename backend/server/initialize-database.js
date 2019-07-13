'use strict';

const fs = require('fs');
const Joi = require('joi');
const Promise = require('bluebird');

const Config = require('./config');
const logger = require('./logger');
const Account = require('./api/models/account-model');
const Customer = require('./api/models/customer-model');
const Transaction = require('./api/models/transaction-model');

const MongoClient = require('mongodb').MongoClient;

function initAccounts(db) {

  function insertAccounts(account, accounts) {

    try {
      const accountId = account.id;
      const err = Joi.validate(account, Account.schema()).error;

      if (err) {
        throw new Error(`Error validating accounts: ${err.message || err}`);
      }

      return Promise.resolve()
        .then(() => {
          return accounts.find({'id': accountId}).limit(1).next();
        })
        .then((foundAccount) => {
          if (!foundAccount) {
            return accounts.insertOne(account);
          } else {
            logger.logInfo(`Account ${foundAccount.id} found, skipped.`);
          }
        });
    }
    catch (err) {
      logger.logError(`Error importing file ${account}: ${err.message || err}`);
    }
  }

  logger.logInfo('Creating "accounts" collection...');

  return Promise.resolve()
    .bind({})
    .then(function () {
      return db.collection('accounts');
    })
    .then(function (accounts) {
      this.accounts = accounts;
      logger.logInfo('Finished creating "accounts" collection');
      return accounts.createIndex({'id': 1}, {'unique': true});
    })
    .then(function () {
      logger.logInfo('Importing "accounts" documents');
      return JSON.parse(fs.readFileSync('./server/db/accounts.json').toString());
    })
    .map(function (accounts) {
      return insertAccounts(accounts, this.accounts);
    })
    .then(function () {
      logger.logInfo('Finished importing "accounts" documents');
    })
    .catch(function (err) {
      return Promise.reject(`Error initializing "accounts" collection: ${err.message || err}`);
    });
}

function initTransactions(db) {

  function insertTransactions(transaction, transactions) {

    try {
      const transactionId = transaction.id;
      const err = Joi.validate(transaction, Transaction.schema()).error;

      if (err) {
        throw new Error(`Error validating transactions: ${err.message || err}`);
      }

      return Promise.resolve()
        .then(() => {
          return transactions.find({'id': transactionId}).limit(1).next();
        })
        .then((foundTransaction) => {
          if (!foundTransaction) {
            return transactions.insertOne(transaction);
          } else {
            logger.logInfo(`Transaction ${foundTransaction.id} found, skipped.`);
          }
        });
    }
    catch (err) {
      logger.logError(`Error importing file ${transaction}: ${err.message || err}`);
    }
  }

  logger.logInfo('Creating "transactions" collection...');

  return Promise.resolve()
    .bind({})
    .then(function () {
      return db.collection('transactions');
    })
    .then(function (transactions) {
      this.transactions = transactions;
      logger.logInfo('Finished creating "transactions" collection');
      return transactions.createIndex({'id': 1}, {'unique': true});
    })
    .then(function () {
      logger.logInfo('Importing "transactions" documents');
      return JSON.parse(fs.readFileSync('./server/db/transactions.json').toString());
    })
    .map(function (transactions) {
      return insertTransactions(transactions, this.transactions);
    })
    .then(function () {
      logger.logInfo('Finished importing "transactions" documents');
    })
    .catch(function (err) {
      return Promise.reject(`Error initializing "transactions" collection: ${err.message || err}`);
    });
}

function initCustomers(db) {

  function insertCustomers(customer, customers) {

    try {
      const customerId = customer.id;
      const err = Joi.validate(customer, Customer.schema()).error;

      if (err) {
        throw new Error(`Error validating customers: ${err.message || err}`);
      }

      return Promise.resolve()
        .then(() => {
          return customers.find({'id': customerId}).limit(1).next();
        })
        .then((foundCustomer) => {
          if (!foundCustomer) {
            return customers.insertOne(customer);
          } else {
            logger.logInfo(`Customer ${foundCustomer.id} found, skipped.`);
          }
        });
    }
    catch (err) {
      logger.logError(`Error importing file ${customer}: ${err.message || err}`);
    }
  }

  logger.logInfo('Creating "customers" collection...');

  return Promise.resolve()
    .bind({})
    .then(function () {
      return db.collection('customers');
    })
    .then(function (customers) {
      this.customers = customers;
      logger.logInfo('Finished creating "customers" collection');
      return customers.createIndex({'id': 1}, {'unique': true});
    })
    .then(function () {
      logger.logInfo('Importing "customers" documents');
      return JSON.parse(fs.readFileSync('./server/db/customers.json').toString());
    })
    .map(function (customers) {
      return insertCustomers(customers, this.customers);
    })
    .then(function () {
      logger.logInfo('Finished importing "customers" documents');
    })
    .catch(function (err) {
      return Promise.reject(`Error initializing "customers" collection: ${err.message || err}`);
    });
}

module.exports = function () {

  const dbUrl = `${Config.get('/mongodb/url')}/${Config.get('/mongodb/name')}`;

  return Promise.resolve()
    .bind({})
    .then(function () {
      this.operation = `connecting to database ${dbUrl}`;
      return MongoClient.connect(dbUrl, {useNewUrlParser: true});
    })
    .then(function (client) {
      this.db = client.db('database');
      logger.logInfo(`Connected to ${client.s.options.dbName}`);
      this.operation = 'reading collection names from database';
      return this.db.listCollections({}).toArray();
    })
    .then(function (collections) {
      const collectionNames = collections.map(collection => collection.name);
      logger.logInfo(`Collections ${collectionNames}`);

      const promises = [];

      promises.push(initAccounts(this.db));
      promises.push(initTransactions(this.db));
      promises.push(initCustomers(this.db));

      return promises;
    })
    .all()
    .catch(function (err) {
      return Promise.reject(new Error(`Error ${this.operation}: ${err.message || err}`));
    });
};
