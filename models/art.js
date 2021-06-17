import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = Schema({
  number: Number,
  name: String,
  description: String,
  type: { type: Schema.Types.ObjectId, ref: 'Type' },
});

export default mongoose.model('Article', schema);
