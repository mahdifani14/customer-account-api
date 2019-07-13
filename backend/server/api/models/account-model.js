'use strict';

const Joi = require('joi');
const uuidv4 = require('uuid/v4');

const utils = require('../../utils');

const schema = Joi.object({
  id: Joi.string().guid({version: ['uuidv4']}).required(),
  customerId: Joi.string().guid({version: ['uuidv4']}).required(),
  deposit: Joi.object({
    value: Joi.number().min(0).required(),
    currency: Joi.string().valid('EUR').required()
  }).required(),
  createdAt: Joi.date()
});

class Account {

  constructor(customerId, value, currency) {
    utils.assertExists(customerId, 'customerId');
    utils.assertExists(value, 'value');
    utils.assertExists(currency, 'currency');

    this.id = uuidv4();
    this.customerId = customerId;
    this.deposit = {value, currency};
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
   * @param {String} doc.customerId
   * @param {Number} doc.value
   * @param {String} doc.currency
   * @returns {Object}
   */
  static fromDocument(doc) {
    if (!doc) {
      return null;
    }

    return new Account(doc.customerId, doc.value, doc.currency);
  }
}

module.exports = Account;