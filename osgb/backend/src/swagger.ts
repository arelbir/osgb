import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'OSGB Yönetim Sistemi API',
      version: '1.0.0',
      description: 'OSGB için RESTful API dokümantasyonu',
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Local API',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ExaminationType: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          },
          example: {
            id: 1,
            name: 'Hemogram',
            description: 'Tam kan sayımı',
            created_at: '2025-04-19T18:00:00.000Z',
            updated_at: '2025-04-19T18:30:00.000Z'
          }
        },
        ServiceGroup: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          },
          example: {
            id: 1,
            name: 'Laboratuvar Testleri',
            description: 'Kan, idrar vb. laboratuvar testleri',
            created_at: '2025-04-19T18:00:00.000Z',
            updated_at: '2025-04-19T18:30:00.000Z'
          }
        },
        Service: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            service_group_id: { type: 'integer' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          },
          example: {
            id: 1,
            name: 'Hemogram',
            description: 'Tam kan sayımı',
            service_group_id: 1,
            created_at: '2025-04-19T18:00:00.000Z',
            updated_at: '2025-04-19T18:30:00.000Z'
          }
        },
        SampleStatus: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          },
          example: {
            id: 1,
            name: 'Beklemede',
            description: 'Numune henüz işleme alınmadı',
            created_at: '2025-04-19T18:00:00.000Z',
            updated_at: '2025-04-19T18:30:00.000Z'
          }
        },
        SampleRejectionReason: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          },
          example: {
            id: 1,
            name: 'Numune uygun değil',
            description: 'Numune bütünlüğü bozulmuş',
            created_at: '2025-04-19T18:00:00.000Z',
            updated_at: '2025-04-19T18:30:00.000Z'
          }
        },
        ExternalLab: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          },
          example: {
            id: 1,
            name: 'Acme Lab',
            description: 'Dış laboratuvar açıklaması',
            created_at: '2025-04-19T18:00:00.000Z',
            updated_at: '2025-04-19T18:30:00.000Z'
          }
        },
        ExternalLabSubmission: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            external_lab_id: { type: 'integer' },
            protocol_id: { type: 'integer' },
            status: { type: 'string' },
            result_url: { type: 'string' },
            sent_at: { type: 'string', format: 'date-time' },
            received_at: { type: 'string', format: 'date-time' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          },
          example: {
            id: 1,
            external_lab_id: 1,
            protocol_id: 2,
            status: 'Beklemede',
            result_url: 'https://lab.com/sonuc/123',
            sent_at: '2025-04-19T18:00:00.000Z',
            received_at: '2025-04-19T18:30:00.000Z',
            created_at: '2025-04-19T18:00:00.000Z',
            updated_at: '2025-04-19T18:30:00.000Z'
          }
        },
        ProtocolService: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            protocol_id: { type: 'integer' },
            service_id: { type: 'integer' },
            quantity: { type: 'integer' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          },
          example: {
            id: 1,
            protocol_id: 1,
            service_id: 2,
            quantity: 1,
            created_at: '2025-04-19T18:00:00.000Z',
            updated_at: '2025-04-19T18:30:00.000Z'
          }
        },
        PaymentType: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          },
          example: {
            id: 1,
            name: 'Nakit',
            description: 'Nakit ödeme',
            created_at: '2025-04-19T18:00:00.000Z',
            updated_at: '2025-04-19T18:30:00.000Z'
          }
        },
        CashRegister: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          },
          example: {
            id: 1,
            name: 'Ana Kasa',
            description: 'Merkez kasa',
            created_at: '2025-04-19T18:00:00.000Z',
            updated_at: '2025-04-19T18:30:00.000Z'
          }
        },
        WebResultUser: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            username: { type: 'string' },
            password: { type: 'string' },
            patient_id: { type: 'integer' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          },
          example: {
            id: 1,
            username: 'webuser1',
            password: 'hashed_password',
            patient_id: 2,
            created_at: '2025-04-19T18:00:00.000Z',
            updated_at: '2025-04-19T18:30:00.000Z'
          }
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Express) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
