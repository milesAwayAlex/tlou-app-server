import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = Schema({
  game: { type: String, required: true },
  number: { type: Number, required: true },
  name: { type: String, required: true },
  sections: [{ type: Schema.Types.ObjectId, ref: 'Section' }],
});

export default mongoose.model('Chapter', schema);
