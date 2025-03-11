const exampleParameters = [
  {
    id: "imageplaceholder",
    parameters: [
      {
        name: "title",
        type: "string",
        description: "Text to display on the placeholder image",
        example: "My Title",
      },
      {
        name: "subtitle",
        type: "string",
        description: "Text to display on the placeholder image",
        example: "My Subtitle",
      },
      {
        name: "width",
        type: "integer",
        description: "Width of the image in pixels",
        default: 800,
        example: 800,
      },
      {
        name: "height",
        type: "integer",
        description: "Height of the image in pixels",
        default: 400,
        example: 400,
      },
      {
        name: "titleSize",
        type: "string",
        description:
          "Size of the title text. Accepted values small, medium, large, xlarge",
        default: "medium",
        example: "medium",
      },
      {
        name: "backgroundType",
        type: "string",
        description:
          "Type of background. Accepted values none, gradient, custom",
        default: "gradient",
        example: "gradient",
      },
      {
        name: "customGradientColors",
        type: "string",
        description:
          "Colors for custom gradient background. Provide as comma-separated values",
        example: "292F56,ACFA70",
      },
    ],
  },
];

const exampleBodies = [
  {
    id: "htmltopdf",
    htmlContent: "<div>Hello, {name}! Welcome to {company}.</div>",
    replacements: [
      { placeholder: "name", value: "John" },
      { placeholder: "company", value: "Bronson Dunbar" },
    ],
    fileName: "output.pdf",
  },
  {
    id: "fileparser",
    contentType: "multipart/form-data",
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
          description: "The XML or CSV file to be parsed",
        },
      },
      required: ["file"],
    },
  },
];

const codeExamples = [
  {
    id: "imageplaceholder",
    examples: [
      {
        fetch: `const response = await fetch('[PATH]?title=Hello&width=800&height=400');
const data = await response.blob();`,
      },
      {
        axios: `const response = await axios.get('[PATH]', {
          params: {
            title: 'Hello',
            width: 800,
            height: 400
          },
          responseType: 'blob'
        });`,
      },
      {
        curl: `curl '[PATH]?title=Hello&width=800&height=400'`,
      },
    ],
  },
  {
    id: "fileparser",
    examples: [
      {
        fetch: `const formData = new FormData();
  formData.append('file', fileInput.files[0]);
  
  const response = await fetch('[PATH]', {
    method: 'POST',
    body: formData
  });
  const data = await response.json();`,
      },
      {
        axios: `const formData = new FormData();
  formData.append('file', fileInput.files[0]);
  
  const response = await axios.post('[PATH]', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });`,
      },
      {
        curl: `curl -X POST '[PATH]' \\
    -H 'Content-Type: multipart/form-data' \\
    -F 'file=@/path/to/your/file.xml'`,
      },
    ],
  },
  {
    id: "htmltopdf",
    examples: [
      {
        fetch: `const response = await fetch('[PATH]', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer YOUR_API_KEY',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            htmlContent: '<div>Hello, {name}! Welcome to {company}.</div>',
            replacements: [
              { placeholder: 'name', value: 'John' },
              { placeholder: 'company', value: 'Bronson Dunbar' },
            ],
            fileName: 'output.pdf'
          })
        }); 
        const data = await response.blob();`,
      },
      {
        axios: `const response = await axios.post('[PATH]', {
          htmlContent: '<div>Hello, {name}! Welcome to {company}.</div>',
          replacements: [
            { placeholder: 'name', value: 'John' },
            { placeholder: 'company', value: 'Bronson Dunbar' },
          ],
          fileName: 'output.pdf'
        }, {
          headers: {
            'Authorization': 'Bearer YOUR_API_KEY'
          },
          responseType: 'blob'
        });`,
      },
      {
        curl: `curl -X POST '[PATH]' \\
            -H 'Authorization: Bearer YOUR_API_KEY' \\
            -H 'Content-Type: application/json' \\
            -d '{"htmlContent": "<div>Hello, {name}! Welcome to {company}.</div>", "replacements": "[{ placeholder: 'name', value: 'John' }, { placeholder: 'company', value: 'Bronson Dunbar' }]", "fileName": "output.pdf"}'`,
      },
    ],
  },
];

const responseExamples = [
  {
    id: "imageplaceholder",
    responses: [
      {
        status: 200,
        description: "Successfully generated SVG image",
        contentType: "image/svg+xml",
        schema: {
          type: "string",
          format: "binary",
          description: "SVG image content",
        },
      },
      {
        status: 500,
        description: "Internal Server Error",
        contentType: "application/json",
        schema: {
          type: "object",
          properties: {
            error: {
              type: "string",
              example: "Internal server error",
            },
          },
        },
      },
    ],
  },
  {
    id: "fileparser",
    responses: [
      {
        status: 200,
        description: "Successfully parsed file",
        contentType: "application/json",
        schema: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                type: "object",
                description: "Parsed data from the file",
              },
              example: [
                {
                  id: "1",
                  name: "John Doe",
                  email: "john@example.com",
                },
                {
                  id: "2",
                  name: "Jane Smith",
                  email: "jane@example.com",
                },
              ],
            },
          },
        },
      },
      {
        status: 400,
        description: "Bad Request",
        contentType: "application/json",
        schema: {
          type: "object",
          properties: {
            error: {
              type: "string",
              example: "Invalid file format or missing file",
            },
          },
        },
      },
      {
        status: 500,
        description: "Internal Server Error",
        contentType: "application/json",
        schema: {
          type: "object",
          properties: {
            error: {
              type: "string",
              example: "Failed to parse file",
            },
          },
        },
      },
    ],
  },
  {
    id: "htmltopdf",
    responses: [
      {
        status: 200,
        description: "Successfully generated PDF",
        contentType: "application/pdf",
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": "attachment; filename=<fileName>.pdf",
          "Access-Control-Allow-Origin": "<origin>",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
        schema: {
          type: "string",
          format: "binary",
          description: "PDF document content",
        },
      },
      {
        status: 400,
        description: "Bad Request - Missing required parameters",
        contentType: "application/json",
        schema: {
          type: "object",
          properties: {
            error: {
              type: "string",
              example: "Missing htmlContent or fileName",
            },
          },
        },
      },
      {
        status: 401,
        description: "Unauthorized - Authentication failed",
        contentType: "application/json",
        schema: {
          type: "object",
          properties: {
            error: {
              type: "string",
              examples: [
                "Unauthorized - Bearer token required",
                "Invalid token",
              ],
            },
          },
        },
      },
      {
        status: 500,
        description: "Internal Server Error",
        contentType: "application/json",
        schema: {
          type: "object",
          properties: {
            error: {
              type: "string",
              example: "Failed to generate PDF",
            },
          },
        },
      },
      {
        status: 204,
        description: "No Content - Successful OPTIONS request",
        headers: {
          "Access-Control-Allow-Origin": "<origin>",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Max-Age": "86400",
        },
        schema: {
          type: "null",
        },
      },
    ],
  },
];

const pricingTiers = [
  {
    id: "htmltopdf",
    tiers: [
      {
        name: "Starter",
        requests: 1000,
        price: 29,
        features: ["1,000 PDF generations per month", "Email support"],
      },
      {
        name: "Pro",
        requests: 5000,
        price: 99,
        highlighted: true,
        features: ["5,000 PDF generations per month", "Priority support"],
      },
      {
        name: "Enterprise",
        requests: 25000,
        price: 499,
        features: ["25,000 PDF generations per month", "Dedicated support"],
      },
    ],
  },
];

export const freeApis: Endpoint[] = [
  {
    id: "imageplaceholder",
    method: "GET",
    path: "/api/v1/image/placeholder",
    description:
      "Generates a dynamic SVG placeholder image with customizable properties",
    parameters:
      exampleParameters.find((obj) => obj.id === "imageplaceholder")
        ?.parameters || [],
    examples:
      codeExamples.find((obj) => obj.id === "imageplaceholder")?.examples || [],
    responses:
      responseExamples?.find((obj) => obj.id === "imageplaceholder")
        ?.responses || [],
  },
  {
    id: "fileparser",
    type: "file",
    method: "POST",
    path: "/api/v1/parse/xmlcsv",
    description: "Parses XML or CSV files and returns the data in JSON format",
    body: JSON.stringify(
      exampleBodies?.find((obj) => obj.id === "fileparser")?.schema || ``
    ),
    examples:
      codeExamples.find((obj) => obj.id === "fileparser")?.examples || [],
    responses:
      responseExamples?.find((obj) => obj.id === "fileparser")?.responses || [],
  },
];

export const paidApis: Endpoint[] = [
  {
    id: "htmltopdf",
    type: "file",
    method: "POST",
    path: "/api/v1/html/pdf",
    description: "Generates a PDF from HTML",
    requiresAuth: true,
    documentationUrl: "#",
    body: JSON.stringify(
      exampleBodies.find((obj) => obj.id === "htmltopdf") || ""
    ),
    examples:
      codeExamples.find((obj) => obj.id === "htmltopdf")?.examples || [],
    responses:
      responseExamples?.find((obj) => obj.id === "htmltopdf")?.responses || [],
    tiers: pricingTiers?.find((obj) => obj.id === "htmltopdf")?.tiers || [],
  },
];

interface Endpoint {
  id: string;
  type?: string;
  method: string;
  path: string;
  description: string;
  requiresAuth?: boolean;
  documentationUrl?: string;
  parameters?: Parameter[];
  body?: string;
  examples?: Example[];
  responses: Response[];
  tiers?: PricingTier[];
}

interface Parameter {
  name: string;
  type: string;
  description: string;
  required?: boolean;
  default?: string | number;
  example?: string | number;
}

interface Example {
  fetch?: string;
  axios?: string;
  curl?: string;
}

interface Response {
  status: number;
  description?: string;
  headers?: Record<string, unknown>;
  contentType?: string;
  schema?: Record<string, unknown>;
  example?: Record<string, unknown> | string;
}
interface PricingTier {
  name: string;
  requests: number;
  price: number;
  features: string[];
  highlighted?: boolean;
}
