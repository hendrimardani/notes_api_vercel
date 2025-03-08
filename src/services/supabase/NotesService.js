const { supabase } = require('./connections');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const { mapDBToModel } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');

class NotesService {
  constructor() {
    this._supabase = supabase;
    this._TABLE = 'notes';
  }

  async addNote({ title, body, tags }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const { data, error } = await this._supabase
                            .from(this._TABLE)
                            .insert([
                              { id: id, title: title, body: body, tags: tags, createdAt: createdAt, updatedAt: updatedAt}
                            ]);
    if (error) {
      throw new InvariantError('Catatan gagal ditambahkan');
    }
    return data;
  }

  async getNotes() {
    const { data, error } = await this._supabase
                            .from(this._TABLE)
                            .select('*');
    return data.map(mapDBToModel);
  }

  async getNoteById(id) {
    const { data, error } = await this._supabase
                            .from(this._TABLE)
                            .eq('id', id);
    if (error) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }
    return data.map(mapDBToModel)[0];    
  }

  async editNoteById(id, { title, body, tags }) {
    const updatedAt = new Date().toISOString();

    const { data, error } = this._supabase
                            .from(this._TABLE)
                            .update({
                              title: title,
                              body: body,
                              tags: tags,
                              updatedAt: updatedAt
                            });
    if (error) {
      throw new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan');
    }
  }

  async deleteNoteById(id) {
    const { data, error } = this._supabase
                            .from(this._TABLE)
                            .delete()
                            .eq('id', id);
    if (error) {
      throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = NotesService;