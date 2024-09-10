const mongoose = require('mongoose');

// Define the schema for the invoice
const invoiceSchema = new mongoose.Schema({
    invoiceType: {
        type: String,
        // required: true
    },
    client: {
        type: String,
        // required: true
    },
    company: {
        type: String,
        // required: true
    },
    bank: {
        type: String,
        // required: true
    },
    invoiceId: {
        type: String,
        // required: true
    },
    invoiceNo: {
        type: String,
        // required: true
    },
    reoccurring: {
        type: String,
        // required: true
    },
    issueDate: {
        type: Date,
        // required: true
    },
    dueDate: {
        type: Date,
        // required: true
    },
    paymentReceived: {
        type: String,
        // required: false
    },
    fees: {
        type: String,
        // required: false
    },
    gst: {
        type: String,
        // required: false
    }
});

// Create the model based on the schema
const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
