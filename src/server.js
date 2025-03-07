const Hapi = require('@hapi/hapi');
const notes = require('./api/notes');
const NotesService = require('./services/inMemory/notesServices');
const NotesValidator = require('./validator/notes');
const ClientError = require('./exceptions/ClientError');

let server;

const init = async () => {
  if (!server) {
    const notesServices = new NotesService();

    server = Hapi.server({
      port: process.env.PORT || 3000,
      host: '0.0.0.0',
      routes: {
        cors: {
          origin: ['*'],
        },
      },
    });

    await server.register({
      plugin: notes,
      options: {
        service: notesServices,
        validator: NotesValidator,
      },
    });

    server.ext('onPreResponse', (request, h) => {
      const { response } = request;
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }
      return h.continue;
    });

    await server.initialize(); // Hanya inisialisasi tanpa start()
  }
  return server;
};

// Handler untuk Vercel
module.exports = async (req, res) => {
  const server = await init();
  
  const response = await server.inject({
    method: req.method,
    url: req.url,
    payload: req.body,
    headers: req.headers
  });

  res.status(response.statusCode).json(response.result);
};
