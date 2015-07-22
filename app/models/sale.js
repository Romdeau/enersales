var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// sale schema
var SaleSchema   = new Schema({
	poNumber: { type: String, required: true, index: { unique: true }},
	customer: { type: String, required: true},
	value: { type: Number, required: true},
	salesman: { type: Schema.Types.Mixed },
	description: { type: String },
	quoteNumber: String,
	meetingDate: { type: Date },
	projectManager: { type: Schema.Types.Mixed },
	accountsManager: { type: Schema.Types.Mixed },
	handoverComplete: { type: Boolean, default: false },
	accountsEntered: { type: Boolean, default: false },
	createdAt: Date
});

module.exports = mongoose.model('Sale', SaleSchema);
