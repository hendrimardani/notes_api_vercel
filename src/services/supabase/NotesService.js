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

    const { data, error } = await this._supabase
                            .from(this._TABLE)
                            .insert([{ id, title, body, tags, created_at, updated_at }]).select();
    // console.log(data, error);
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
                            .select('*')
                            .eq('id', id);
    if (error) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }
    return data.map(mapDBToModel)[0];    
  }

  async editNoteById(id, newTitle, newTags, newBody) {
    const updatedAt = new Date().toISOString();
    const { data, error } = this._supabase
                            .from(this._TABLE)
                            .update({
                              title: "newTitle",
                              body: "newBody",
                              tags: ["newTags", "asdasda"],
                              updatedAt: updatedAt
                            })
                            .eq('id', id);
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