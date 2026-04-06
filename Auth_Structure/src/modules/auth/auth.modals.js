import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'


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


// Hash the password before saving 
userSchema.pre('save', async () => {
    if (!this.isModified("password")) return;
    this.password = await bcrypt(this.password, 12)

})
userSchema.methods.comparePassword = async (enteredPassword) => {
    return await bcrypt.compare(enteredPassword,this.password)
}


const User = mongoose.model('User', userSchema);

export default User