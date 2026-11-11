import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 60 },
    email: {
      type: String, required: [true, 'Email is required'], unique: true,
      lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Enter a valid email']
    },
    password: { type: String, required: true, minlength: [6, 'Password needs at least 6 characters'], select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isBanned: { type: Boolean, default: false },
    avatar: { type: String, default: '' },
    bio: { type: String, maxlength: 600, default: '' },
    age: { type: Number, min: 18, max: 99 },
    gender: { type: String, enum: ['male', 'female', 'non-binary', 'other', ''], default: '' },
    occupation: { type: String, trim: true, maxlength: 80, default: '' },
    city: { type: String, trim: true, default: '' },

    // Roommate-finder profile
    seeking: { type: Boolean, default: false }, // show me in the roommate finder
    budget: { min: { type: Number, default: 0 }, max: { type: Number, default: 0 } },
    moveInDate: { type: Date },
    preferredLocalities: [{ type: String, trim: true }],
    lifestyle: {
      smoking: { type: String, enum: ['no', 'outside', 'yes'], default: 'no' },
      pets: { type: String, enum: ['no', 'ok', 'have'], default: 'ok' },
      cleanliness: { type: Number, min: 1, max: 5, default: 3 },
      sleep: { type: String, enum: ['early', 'flexible', 'night'], default: 'flexible' },
      guests: { type: String, enum: ['rarely', 'sometimes', 'often'], default: 'sometimes' },
      diet: { type: String, enum: ['any', 'vegetarian', 'vegan'], default: 'any' }
    },

    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }]
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model('User', userSchema);
