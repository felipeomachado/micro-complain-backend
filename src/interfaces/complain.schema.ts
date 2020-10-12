import * as mongoose from 'mongoose';

export const ComplainSchema = new mongoose.Schema({
  title: String,
  description: String,
  locale: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'locale'
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'company'
  }
}, {timestamps: true, collection: 'complain'})