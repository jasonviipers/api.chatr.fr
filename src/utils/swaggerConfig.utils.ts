import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Video Chat API',
            version: '1.0.0',
            description: 'Video Chat API',
            contact: {
                name: 'Jason YT',
                url: 'chatr.fr',
                email: 'jason@chatr.fr',
            },
        },
        servers: [
            {
                url: 'http://localhost:4000',
                description: 'Development server',
            },
        ],
    },
    apis: ['src/routes/*.ts'],
};

const specs = swaggerJsdoc(options);

export default specs;
