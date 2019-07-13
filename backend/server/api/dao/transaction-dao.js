'use strict';
const {omit} = require('lodash');
const Promise = require('bluebird');

const Config = require('../../config');

const MongoClient = require('mongodb').MongoClient;

class TransactionDao {

  constructor() {
    const dbUrl = `${Config.get('/mongodb/url')}/${Config.get('/mongodb/name')}`;
    this.collection = MongoClient.connect(dbUrl, {useNewUrlParser: true})
      .then(db => db.db('database').collection('transactions'));
  }

  createTransaction(transaction) {
    return this.collection
      .then((accounts) => {
        return accounts.insertOne(transaction);
      });
  }

  findTransactions(id) {
    const data = {};

    return this.collection
      .then((transactionsCollection) => {
        data.collection = transactionsCollection;
        const firstCursor = transactionsCollection.find({customerId: id});

        return Promise.fromCallback(function (cb) {
          return firstCursor.toArray(cb);
        });
      })
      .then((docs) => {
        data.docs = docs;
        const secondCursor = data.collection.find({customerId: id});

        return Promise.fromCallback(function (cb) {
          return secondCursor.count(cb);
        })
      })
      .then((count) => ({
        transactions: data.docs.map(doc => omit(doc, ['_id', 'customerId'])),
        total: count
      }));
  }
}

module.exports = TransactionDao;
