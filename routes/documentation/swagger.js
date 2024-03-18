#!/usr/bin/env node

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import { version, description } from '../../package.json';
import PORT from '../../server';

const swaggerDefinition = {
  // openapi: '3.1.0',
  swagger: '2.0',
  info: {
    title: 'My Marketplace',
    version,
    description: description
  },
  servers: [
    {
      url: `http://localhost:4000`, // Update with your server URL
      description: 'Development server',
    },
  ],
  securityDefinitions: {
    bearerAuth: {
      type: 'http',
      schema: 'bearer',
      bearerFormat: 'JWT'
    },
    apiKeyAuth: {
      in: 'header',
      name: 'X-Token',
      type: 'apiKey'
    }
  },
  // components: {
  //   securitySchemas: {
  //     bearerAuth: {
  //       type: 'http',
  //       schema: 'bearer',
  //       bearerFormat: 'JWT'
  //     },
  //     apiKeyAuth: {
  //       in: 'header',
  //       name: 'X-Token',
  //       type: 'apiKey'
  //     }
  //   }
  // },
  security: [
    {
      bearerAuth: []
    },
    {
      apiKeyAuth: []
    }
  ]
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js', './controller/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

const apiDocs = (app) => {
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
  app.get('/api-docs.json', (req, res) => {
    return res.status(200).json(swaggerSpec);
  });
};

export default apiDocs;
