import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema(
  {
    selected: { type: Boolean, default: false },
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    paidAt: { type: Date }
  },
  { _id: false }
);

const AttendanceSchema = new mongoose.Schema(
  {
    day1: { type: Boolean, default: false },
    day2: { type: Boolean, default: false }
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    yutiraId: { type: String, unique: true, sparse: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, index: true },
    college: { type: String, required: true },
    department: { type: String, required: true },
    year: { type: String, required: true },
    isPSG: { type: Boolean, default: false },

    general: { type: PaymentSchema, default: () => ({}) },
    workshop: { type: PaymentSchema, default: () => ({}) },

    emailVerified: { type: Boolean, default: false },
    verificationTokenHash: { type: String },
    verificationTokenExpiresAt: { type: Date },

    passwordHash: { type: String, required: true },

    resetTokenHash: { type: String },
    resetTokenExpiresAt: { type: Date },

    attendance: { type: AttendanceSchema, default: () => ({}) },

    role: { type: String, enum: ['user', 'admin'], default: 'user' }
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
