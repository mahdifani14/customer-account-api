'use strict';

const {omit} = require('lodash');
const Promise = require('bluebird');

const Config = require('../../config');
const MongoClient = require('mongodb').MongoClient;

class AccountDao {

  constructor() {
    const dbUrl = `${Config.get('/mongodb/url')}/${Config.get('/mongodb/name')}`;
    this.collection = MongoClient
      .connect(dbUrl, {useNewUrlParser: true})
      .then(db => db.db('database').collection('accounts'));
  }

  createAccount(account) {
    return this.collection
      .then((accounts) => {
        return accounts.insertOne(account);
      });
  }

  findAccounts(id) {
    const data = {};

    return this.collection
      .then((accountsCollection) => {
        data.collection = accountsCollection;
        const firstCursor = accountsCollection.find({customerId: id});

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
        accounts: data.docs.map(doc => omit(doc, ['_id', 'customerId'])),
        total: count
      }));
  }
}

module.exports = AccountDao;
