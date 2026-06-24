import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        select: false, // Exclude password from query results by default
        minlength: 8,
    },
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    phoneNumber: {
        type: String,
        unique: true,
        sparse: true, // Allows for null values
    },
    address: {
        type: String,
        trim: true,
    },
    deletedAt: {
        type: Date,
        default: null,
        index: true, // Index for efficient queries
    },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        // Hash the password before saving
        this.password = await bcrypt.hash(this.password, 10);
        next();
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};