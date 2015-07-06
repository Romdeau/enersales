var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// sale schema
var SaleSchema   = new Schema({
	poNumber: { type: String, required: true, index: { unique: true }},
	customer: { type: String, required: true},
	value: { type: Number, required: true},
	salesman: { type: String, required: true},
	description: { type: String, required: true},
	quoteNumber: String,
	meetingDate: {type: Date, required: true },
	projectManager: {type: String, required: true },
	handoverComplete: {type: Boolean, default: false},
	accountsEntered: {type: Boolean, default: false}
});

module.exports = mongoose.model('Sale', SaleSchema);
