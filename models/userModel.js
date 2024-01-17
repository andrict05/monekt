import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "crypto";

/**************************************************/
// SCHEMA
/**************************************************/
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required."],
    unique: true,
    minLength: 3,
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Email is not valid."],
  },
  password: {
    type: String,
    required: [true, "Password is required."],
    select: false,
    minLength: 8,
  },
  passwordConfirm: {
    type: String,
    select: false,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same.",
    },
    minLength: 8,
    required: [true, "Please confirm your password"],
  },
  birthDate: {
    type: Date,
    required: [true, "Please select a birth date"],
  },
  gender: {
    type: String,
    enum: {
      values: ["male", "female"],
      message: "Gender can be male or female",
    },
    required: [true, "Gender is required."],
  },
  profilePicture: {
    type: String,
    default: "avatar-default.svg",
  },
  profileCoverPicture: {
    type: String,
  },
  description: {
    type: String,
  },
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  profileCreatedTime: {
    type: Date,
    default: Date.now(),
  },
  passwordChangedTime: {
    type: Date,
    select: false,
  },
  passwordResetToken: {
    select: false,
    type: String,
  },
  passwordResetExpireTime: {
    type: Date,
    select: false,
  },
});

/**************************************************/
// MIDDLEWARE
/**************************************************/
userSchema.pre(/^find/, function (next) {
  this.select("-__v");
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedTime = Date.now() - 1000;
});

userSchema.post("save", async function (document) {
  document.password = undefined;
});

/**************************************************/
// METHODS
/**************************************************/
userSchema.methods.correctPassword = async function (plainData, encryptedData) {
  return await bcrypt.compare(plainData, encryptedData);
};

userSchema.methods.wasPasswordChangedAfter = function (JWTtimestamp) {
  if (this?.passwordChangedTime) {
    return +JWTtimestamp * 1000 < this.passwordChangedTime;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetToken = hashedToken;
  this.passwordResetExpireTime = Date.now() + 15 * 60 * 1000;
  await this.save({ validateBeforeSave: true });
  return resetToken;
};

const userModel = mongoose.model("User", userSchema);

export default userModel;
