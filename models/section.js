import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = Schema({
  number: { type: Number, required: true },
  name: { type: String, required: true },
  articles: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
});

export default mongoose.model('Section', schema);
