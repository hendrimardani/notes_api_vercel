// mengimpor dotenv dan menjalankan konfigurasinya
require('dotenv').config();

const Hapi = require('@hapi/hapi');
const notes = require('./api/notes');
const NotesService = require('./services/supabase/NotesService');
const NotesValidator = require('./validator/notes');
const ClientError = require('./exceptions/ClientError');

let server;

const init = async () => {
  if (!server) {
    const notesServices = new NotesService();

    server = Hapi.server({
      port: process.env.PORT,
      host: process.env.HOST,
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

    // Jika dijalankan di vercel
    await server.initialize();
    
    // Jika dijalankan di localhost
    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
  }
  return server;
};

// Jika dijalankan di vercel
init();

// Jika dijalankan di localhost
// module.exports = async (req, res) => {
//   const server = await init();
  
//   const response = await server.inject({
//     method: req.method,
//     url: req.url,
//     payload: req.body,
//     headers: req.headers
//   });

//   res.status(response.statusCode).json(response.result);
// };
