export const specs = {
  openapi: '3.0.0',
  info: {
    title: 'Library Management System API',
    version: '1.0.0',
    description: 'A Node.js TypeScript API built with TypeORM QueryBuilder, Swagger documentation, and JWT Authentication',
  },
  servers: [{ url: "http://localhost:3000" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [{ bearerAuth: [] }], 
  paths: {
    "/auth/register": {
      post: {
        summary: "Register a new user",
        tags: ["Authentication"],
        security: [], //does not require a token
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { email: { type: "string" }, password: { type: "string" } },
              },
            },
          },
        },
        responses: { "201": { description: "Registered successfully" } },
      },
    },
    "/auth/login": {
      post: {
        summary: "Login and receive a JWT",
        tags: ["Authentication"],
        security: [], //does not require a token
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { email: { type: "string" }, password: { type: "string" } },
              },
            },
          },
        },
        responses: { "200": { description: "Returns JWT Token" } },
      },
    },
    "/books": {
      get: {
        summary: "Retrieve a list of all books",
        tags: ["Books"],
        security: [],
        responses: { "200": { description: "Success" } },
      },
      post: {
        summary: "Create a new book (Protected)",
        tags: ["Books"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { title: { type: "string" }, author: { type: "string" }, publishedYear: { type: "integer" } },
              },
            },
          },
        },
        responses: { "201": { description: "Created" } },
      },
    },
    "/books/bulk-import": {
      post: {
        summary: "Bulk import books from a CSV file path (Admin only)",
        tags: ["Books"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  filePath: { type: "string", description: "Absolute path to the CSV file on the server" }
                },
                required: ["filePath"]
              }
            }
          }
        },
        responses: {
          "201": { description: "Bulk book import completed" },
          "400": { description: "Invalid CSV or request body" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" }
        }
      }
    },
    "/books/{id}": {
      get: {
        summary: "Retrieve a single book by ID",
        tags: ["Books"],
        security: [],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } }
        ],
        responses: {
          "200": { description: "Book details fetched successfully" },
          "404": { description: "Book not found" }
        }
      },
      put: {
        summary: "Update an existing book by ID (Protected)",
        tags: ["Books"],
        // Requires token, so security is not specified
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  author: { type: "string" },
                  publishedYear: { type: "integer" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Book updated successfully" },
          "404": { description: "Book not found" }
        }
      },
      delete: {
        summary: "Delete a book by ID (Protected)",
        tags: ["Books"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Deleted" } },
      },
    },
    "/loans/issue": {
      post: {
        summary: "Issue a book to a user (Admin only)",
        tags: ["Loans"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  user_id: { type: "integer" },
                  book_id: { type: "integer" },
                  due_date: { type: "string", format: "date" }
                },
                required: ["user_id", "book_id", "due_date"]
              }
            }
          }
        },
        responses: {
          "201": { description: "Loan created successfully" },
          "400": { description: "Invalid request" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" }
        }
      }
    },
    "/loans/my-loans": {
      get: {
        summary: "Retrieve loans for the authenticated user",
        tags: ["Loans"],
        responses: {
          "200": { description: "List of user's loans" },
          "401": { description: "Unauthorized" }
        }
      }
    },
    "/loans/{id}": {
      get: {
        summary: "Retrieve an issued loan by ID (Admin only)",
        tags: ["Loans"],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } }
        ],
        responses: {
          "200": { description: "Issued loan retrieved successfully" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
          "404": { description: "Issued loan not found" }
        }
      }
    },
    "/loans/return/{id}": {
      post: {
        summary: "Return an issued book (Admin only)",
        tags: ["Loans"],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } }
        ],
        responses: {
          "200": { description: "Book returned successfully" },
          "400": { description: "Invalid request" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
          "404": { description: "Issued loan not found or already returned" }
        }
      }
    },
    "/roles": {
      post: {
        summary: "Create a new role (Admin only)",
        tags: ["Roles"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  role_name: { type: "string" },
                  description: { type: "string" }
                },
                required: ["role_name"]
              }
            }
          }
        },
        responses: {
          "201": { description: "Role created successfully" },
          "400": { description: "Invalid request" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" }
        }
      }
    }
  },
};

