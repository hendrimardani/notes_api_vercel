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
    const created_at = new Date().toISOString();
    const updated_at = created_at;

    const { data } = await this._supabase
                            .from(this._TABLE)
                            .insert([{ id, title, body, tags, created_at, updated_at }]).select();
    // console.log(data);
    if (data.length === 0) {
      throw new InvariantError('Catatan gagal ditambahkan');
    }
    return data;
  }

  async getNotes() {
    const { data } = await this._supabase
                            .from(this._TABLE)
                            .select('*');
    return data.map(mapDBToModel);
  }

  async getNoteById(id) {
    const { data } = await this._supabase
                            .from(this._TABLE)
                            .select('*')
                            .eq('id', id);
    // console.log(data);
    if (data.length === 0) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }
    return data.map(mapDBToModel)[0];    
  }

  async editNoteById(id, newTitle, newTags, newBody) {
    const updatedAt = new Date().toISOString();
    const { data } = await this._supabase
                            .from(this._TABLE)
                            .update({
                              title: newTitle,
                              tags: newTags,
                              body: newBody,
                              updated_at: updatedAt
                            })
                            .eq('id', id)
                            .select();
    // console.log(data);
    if (data.length === 0) {
      throw new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan');
    }
  }

  async deleteNoteById(id) {
    const { data } = await this._supabase
                            .from(this._TABLE)
                            .delete()
                            .eq('id', id)
                            .select();
    if (data.length === 0) {
      throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = NotesService;