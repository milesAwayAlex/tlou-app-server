import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = Schema({
  game: { type: String, required: true },
  name: { type: String, required: true },
});

export default mongoose.model('Type', schema);
