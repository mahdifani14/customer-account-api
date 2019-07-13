'use strict';

const Confidence = require('confidence');
const HapiSwagger = require('hapi-swagger');

const PackageJson = require('./../package.json');

const env = process.env.NODE_ENV || 'local';
const criteria = {
  env: env,
  // activate debug logs only when env = 'local' or when explicitly activated
  debug_enabled: env === 'local' || process.env.LOG_DEBUG_ENABLED === 'true'
};

const config = {
  $meta: 'Application configuration',
  env: env,
  projectName: PackageJson.name,
  host: process.env.HOST || 'localhost',
  port: {
    api: {
      $filter: 'env',
      test: 9090,
      $default: process.env.PORT || 8080
    }
  },
  logging: {
    opsInterval: 5000,
    events: {
      $filter: 'debug_enabled',

      // debug enabled: log EVERYTHING
      true: {
        request: '*',
        log: '*',
        'error': '*'
      },

      // debug disabled: only info, warn and error
      false: {
        request: ['info', 'warn', 'error'],
        log: ['info', 'warn', 'error'],
        'error': '*'
      }
    }
  },
  swagger: {
    plugin: HapiSwagger,
    options: {
      info: {
        title: PackageJson.name,
        description: PackageJson.description,
        version: PackageJson.version
      },
      swaggerUI: true,
      basePath: '/',
      pathPrefixSize: 2,
      sortPaths: 'path-method',
      documentationPath: '/',
      tags: [
        {
          name: 'customer',
          description: 'Create customer and get accounts information'
        },
        {
          name: 'account',
          description: 'Create and get customer accounts'
        }
      ],
      grouping: 'tags'
    }
  },
  mongodb: {
    url: process.env.MONGODB_URL || 'mongodb://localhost:27017',
    name: process.env.MONGODB_NAME || 'customer',
    options: {
      bufferMaxEntries: 0,
      reconnectTries: process.env.MONGODB_RECONNECT_TRIES || Number.MAX_SAFE_INTEGER,
      reconnectInterval: process.env.MONGODB_RECONNECT_INTERVAL || 15000
    }
  }
};

const store = new Confidence.Store(config);

exports.get = function (key) {
  return store.get(key, criteria);
};

exports.meta = function (key) {
  return store.meta(key, criteria);
};
