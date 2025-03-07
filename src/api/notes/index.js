const NotesHandler = require('./handler');
const routes = require('./routes');

function notes() {
  return {
    name: 'notes',
    version: '1.0.0',
    register: async (server, { service, validator }) => {
      const notesHandler = new NotesHandler(service, validator);
      server.route(routes(notesHandler));
    },
  };
}

module.exports = { notes };