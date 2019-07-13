'use strict';

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
}

module.exports = AccountDao;
