'use strict';

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
}

module.exports = TransactionDao;
