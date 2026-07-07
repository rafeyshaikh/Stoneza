import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        length: 10,
    },
    projectType: {
        type: String,
        required: true,
        trim: true,
    },
    city: {
        type: String,
        required: true,
        trim: true,
    },
    area: {
        type: String,
        required: true,
        trim: true,
    },
    stoneType: {
        type: String,
        required: true,
        trim: true,
    },
});

const Enquiry = mongoose.models.Enquiry || mongoose.model('Enquiry', enquirySchema);

export default Enquiry;