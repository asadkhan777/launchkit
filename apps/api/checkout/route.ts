import fastifyCaching from '@fastify/caching';
import fastifyCompress from '@fastify/compress';
import fastify from 'fastify';

const app = fastify();

// Register caching plugin
app.register(fastifyCaching);

// Register compression plugin with Brotli and gzip support
app.register(fastifyCompress, {
  encodings: ['br', 'gzip'],
});
