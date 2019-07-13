'use strict';

const Joi = require('joi');
const uuidv4 = require('uuid/v4');

const utils = require('../../utils');

const schema = Joi.object({
  id: Joi.string().guid({version: ['uuidv4']}).required(),
  name: Joi.string().required(),
  createdAt: Joi.date()
});

class Customer {

  constructor(name) {
    utils.assertExists(name, 'name');

    this.id = uuidv4();
    this.name = name;
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
   * @param {String} doc.name
   * @returns {Object}
   */
  static fromDocument(doc) {
    if (!doc) {
      return null;
    }

    return new Customer(doc.name);
  }
}

module.exports = Customer;