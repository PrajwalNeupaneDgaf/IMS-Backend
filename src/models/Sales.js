const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema(
  {
    itemName: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true }, // Reference to Item model
    category: { type: String, required: true },
    soldTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Entity', required: true }, // Reference to Customer model
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Entity', required: true }, // Reference to Supplier model
    soldOn: { type: Date, required: true },
    price: { type: Number, required: true },
    amountSold: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Sale', saleSchema);
