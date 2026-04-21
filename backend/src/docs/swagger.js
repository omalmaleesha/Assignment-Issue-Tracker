const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Issue Tracker API',
      version: '1.0.0',
      description: 'API documentation for the Issue Tracker backend'
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', minLength: 6, example: 'password123' }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', example: 'password123' }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Issue: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Login page bug' },
            description: { type: 'string', example: 'Login fails on invalid redirect flow' },
            status: {
              type: 'string',
              enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
              example: 'Open'
            },
            priority: { type: 'string', enum: ['Low', 'Medium', 'High'], example: 'High' },
            user_id: { type: 'integer', example: 1 },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        CreateIssueRequest: {
          type: 'object',
          required: ['title', 'description'],
          properties: {
            title: { type: 'string', example: 'Login page bug' },
            description: { type: 'string', example: 'Login fails on invalid redirect flow' },
            status: {
              type: 'string',
              enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
              example: 'Open'
            },
            priority: { type: 'string', enum: ['Low', 'Medium', 'High'], example: 'High' }
          }
        },
        UpdateIssueRequest: {
          type: 'object',
          properties: {
            title: { type: 'string', example: 'Login page edge-case bug' },
            description: { type: 'string', example: 'Occurs when callback URL is missing' },
            status: {
              type: 'string',
              enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
              example: 'In Progress'
            },
            priority: { type: 'string', enum: ['Low', 'Medium', 'High'], example: 'Medium' }
          }
        },
        UpdateStatusRequest: {
          type: 'object',
          required: ['status'],
          properties: {
            status: { type: 'string', enum: ['Resolved', 'Closed'], example: 'Resolved' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Invalid or expired token' }
          }
        }
      }
    },
    paths: {
      '/health': {
        get: {
          tags: ['Health'],
          summary: 'Health check',
          responses: {
            200: {
              description: 'Service is healthy'
            }
          }
        }
      },
      '/api/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RegisterRequest' }
              }
            }
          },
          responses: {
            201: {
              description: 'User registered',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'User registered successfully' },
                      data: {
                        type: 'object',
                        properties: {
                          user: { $ref: '#/components/schemas/User' },
                          token: { type: 'string' }
                        }
                      }
                    }
                  }
                }
              }
            },
            409: {
              description: 'Email already exists',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' }
                }
              }
            }
          }
        }
      },
      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login and receive JWT token',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginRequest' }
              }
            }
          },
          responses: {
            200: {
              description: 'Login successful'
            },
            401: {
              description: 'Invalid credentials',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' }
                }
              }
            }
          }
        }
      },
      '/api/issues': {
        post: {
          tags: ['Issues'],
          summary: 'Create a new issue',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateIssueRequest' }
              }
            }
          },
          responses: {
            201: { description: 'Issue created successfully' },
            400: { description: 'Validation error' },
            401: {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' }
                }
              }
            }
          }
        },
        get: {
          tags: ['Issues'],
          summary: 'Get all issues with pagination and filters',
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'query', name: 'page', schema: { type: 'integer', minimum: 1, default: 1 } },
            {
              in: 'query',
              name: 'limit',
              schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 }
            },
            {
              in: 'query',
              name: 'status',
              schema: { type: 'string', enum: ['Open', 'In Progress', 'Resolved', 'Closed'] }
            },
            {
              in: 'query',
              name: 'priority',
              schema: { type: 'string', enum: ['Low', 'Medium', 'High'] }
            },
            { in: 'query', name: 'search', schema: { type: 'string' } }
          ],
          responses: {
            200: { description: 'Issues fetched successfully' },
            401: {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' }
                }
              }
            }
          }
        }
      },
      '/api/issues/export/json': {
        get: {
          tags: ['Issues'],
          summary: 'Download all issues as a JSON file',
          description: 'Exports issues for the authenticated user as a downloadable JSON file. Supports optional filters.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'query',
              name: 'status',
              schema: { type: 'string', enum: ['Open', 'In Progress', 'Resolved', 'Closed'] }
            },
            {
              in: 'query',
              name: 'priority',
              schema: { type: 'string', enum: ['Low', 'Medium', 'High'] }
            },
            { in: 'query', name: 'search', schema: { type: 'string' } }
          ],
          responses: {
            200: {
              description: 'JSON export file stream',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Issues exported successfully' },
                      exportedAt: { type: 'string', format: 'date-time' },
                      count: { type: 'integer', example: 4 },
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Issue' }
                      }
                    }
                  }
                }
              }
            },
            401: {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' }
                }
              }
            }
          }
        }
      },
      '/api/issues/{id}': {
        get: {
          tags: ['Issues'],
          summary: 'Get issue by ID',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Issue fetched successfully' },
            404: { description: 'Issue not found' }
          }
        },
        put: {
          tags: ['Issues'],
          summary: 'Update issue by ID',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UpdateIssueRequest' }
              }
            }
          },
          responses: {
            200: { description: 'Issue updated successfully' },
            404: { description: 'Issue not found' }
          }
        },
        delete: {
          tags: ['Issues'],
          summary: 'Delete issue by ID',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Issue deleted successfully' },
            404: { description: 'Issue not found' }
          }
        }
      },
      '/api/issues/{id}/status': {
        patch: {
          tags: ['Issues'],
          summary: 'Update issue status (Resolved/Closed)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UpdateStatusRequest' }
              }
            }
          },
          responses: {
            200: { description: 'Issue status updated successfully' },
            404: { description: 'Issue not found' }
          }
        }
      }
    }
  },
  apis: []
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
