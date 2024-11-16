import mongoose, { Schema } from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        trim: true,
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
        required: true
    },
    contactNumber: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'superAdmin'],  
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    },
});

// Generate JWT token (with role included in the payload)
userSchema.methods.generateToken = function () {
    try {
        return jwt.sign(
            { id: this._id, role: this.role },  // Payload includes both user ID and role
            process.env.JWT_SECRET,             // Secret key (stored securely in .env)
            { expiresIn: '28d' }                // Token expires in 28 days
        );
    } catch (error) {
        console.error(error);
        throw new Error('Error generating JWT token');
    }
};

// Hashing password before saving it to the database
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    this.updatedAt = Date.now();
    next();
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};


export default mongoose.model("User", userSchema);
