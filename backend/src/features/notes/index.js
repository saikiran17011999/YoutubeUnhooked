/**
 * Notes Feature Module
 * Exports all note-related components
 */

const Note = require('./model/note.model');
const noteService = require('./service/note.service');
const noteController = require('./controller/note.controller');
const noteRoutes = require('./routes/note.routes');

module.exports = {
  Note,
  noteService,
  noteController,
  noteRoutes
};
