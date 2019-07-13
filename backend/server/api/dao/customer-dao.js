'use strict';

const Config = require('../../config');
const MongoClient = require('mongodb').MongoClient;

class CustomerDao {

  constructor() {
    const dbUrl = `${Config.get('/mongodb/url')}/${Config.get('/mongodb/name')}`;
    this.collection = MongoClient.connect(dbUrl, {useNewUrlParser: true})
      .then(db => db.db('database').collection('customers'));
  }

  findCustomer(customerId) {
    return this.collection
      .then(customers => {
        return customers.findOne({'id': customerId});
      })
  }
}

module.exports = CustomerDao;
