const mongoose = require('mongoose');

const MedicationSchema = new mongoose.Schema({
	patient_id: {
		type: String,
		required: true,
	},
	patient_name: {
		type: String,
	},
	time: {
		type: String,
	},
	date: {
		type: String,
	},
	medication_name: {
		type: String,
	},
	medication_quantity: {
		type: String,
	},
	acceptance: {
		type: String,
		default: 'pending',
	},
	rejectedMessage: {
		type: String,
	},
	price: {
		type: String,
	},
});

module.exports = mongoose.model('medications', MedicationSchema);
