const Hapi = require('@hapi/hapi');
// const notes = require('./api/notes');
const NotesService = require('./services/inMemory/notesServices');
const NotesValidator = require('./validator/notes');
const ClientError = require('./exceptions/ClientError');
const NotesHandler = require('./handler');
const routes = require('./routes');

const init = async () => {
  const notesServices = new NotesService();

  const server = Hapi.server({
    port: 5000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // await server.register({
  //   plugin: notes,
  //   options: {
  //     service: notesServices,
  //     validator: NotesValidator,
  //   },
  // });

  await server.register({
    plugin:  {
      name: 'notes',
      version: '1.0.0',
      register: async (server, { service, validator }) => {
        const notesHandler = new NotesHandler(service, validator);
        server.route(routes(notesHandler));
      },
    },
    options: {
      service: notesServices,
      validator: NotesValidator,
    },
  });

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;
  
    // penanganan client error secara internal.
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

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
