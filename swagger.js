const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  swaggerDefinition: {
    info: {
      title: 'Your API Documentation',
      version: '1.0.0',
      description: 'API documentation for your application',
    },
    basePath: '/', // Base path for your API
  },
  // Replace this with the correct path to your route files
  apis: ['./jwtToken.js', './useraccount.js', './login.js', './order.js', './payment.js', './productRoutes.js', './category.js'],
};

const specs = swaggerJsdoc(options);

module.exports = {
  serveSwaggerUI: swaggerUi.serve,
  setupSwaggerUI: swaggerUi.setup(specs),
};
