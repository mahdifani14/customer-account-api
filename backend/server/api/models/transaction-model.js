'use strict';

const Joi = require('joi');
const uuidv4 = require('uuid/v4');

const utils = require('../../utils');

const schema = Joi.object({
  id: Joi.string().guid({version: ['uuidv4']}).required(),
  accountId: Joi.string().guid({version: ['uuidv4']}).required(),
  customerId: Joi.string().guid({version: ['uuidv4']}).required(),
  amount: Joi.number().min(0).required(),
  currency: Joi.string().valid('EUR').required(),
  action: Joi.string().valid(['DEC', 'INC']).required(),
  createdAt: Joi.date()
});

class Transaction {

  constructor(accountId, customerId, amount, currency, action) {
    utils.assertExists(accountId, 'accountId');
    utils.assertExists(customerId, 'customerId');
    utils.assertExists(amount, 'amount');
    utils.assertExists(currency, 'currency');
    utils.assertExists(action, 'action');

    this.id = uuidv4();
    this.accountId = accountId;
    this.customerId = customerId;
    this.amount = amount;
    this.currency = currency;
    this.action = action;
    this.createdAt = new Date();
  }

  static schema() {
    return schema;
  }

  /**
   * Validate object.
   *
   * @returns {Boolean} `true` if validation was successful
   * @throws {Error} if validation was unsuccessful
   */
  validate() {
    const err = Joi.validate(this, schema).error;
    if (err) throw err;
    return true;
  }

  /**
   * @param {String} doc.accountId
   * @param {String} doc.customerId
   * @param {Number} doc.amount
   * @param {String} doc.currency
   * @param {String} doc.action
   * @returns {Object}
   */
  static fromDocument(doc) {
    if (!doc) {
      return null;
    }

    return new Transaction(doc.accountId, doc.customerId, doc.amount, doc.currency, doc.action);
  }
}

module.exports = Transaction;