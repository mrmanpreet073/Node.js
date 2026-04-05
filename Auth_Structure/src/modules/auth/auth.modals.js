import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: 2,
            maxlength: 50,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 8,
            select: false,
        },
        role: {
            type: String,
            enum: ["customer", "seller", "admin", "support"],
            default: "customer",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        verificationToken: { type: String, select: false },
        refreshToken: { type: String, select: false },
        resetPasswordToken: { type: String, select: false },
        resetPasswordExpires: { type: Date, select: false },
    },
    { timestamps: true },
);


const User = mongoose.model('User', userSchema);

export default User