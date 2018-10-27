const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    title: { type: String, required: true },
    comments: [String],
    commentcount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Book', BookSchema);
