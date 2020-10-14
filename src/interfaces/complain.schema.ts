import * as mongoose from 'mongoose';

export const ComplainSchema = new mongoose.Schema({
  title: String,
  description: String,
  locale: {
    type: mongoose.Schema.Types.ObjectId
  },
  company: {
    type: mongoose.Schema.Types.ObjectId
  }
}, {timestamps: true, collection: 'complain'})