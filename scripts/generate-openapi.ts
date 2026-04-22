import { generateOpenApiDocument } from 'trpc-openapi';
import { appRouter } from '../src/app.router';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const openApiDocument = generateOpenApiDocument(appRouter, {
  title: 'MyCircle API',
  version: '1.0.0',
  baseUrl: 'http://localhost:3000/api',
});

try {
  writeFileSync(join(process.cwd(), 'openapi-spec.json'), JSON.stringify(openApiDocument, null, 2));
  console.log('OpenAPI spec generated: openapi-spec.json');
} catch (error) {
  console.error('Failed to generate OpenAPI spec:', error);
}
