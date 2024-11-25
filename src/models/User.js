const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Use mongoose.model() to check if the model is already defined
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'employee', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true, 
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Avoid overwriting the model if it's already defined
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
