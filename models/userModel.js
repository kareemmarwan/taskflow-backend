const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: [true, "Please add a gender"],
    },
    // 🔥 إضافة حقل الرتبة هنا
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user", // أي مستخدم يسجل يكون user تلقائياً
    },
    code: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "https://example.com/default-avatar.png",
    },
    subscription: {
      isActive: { type: Boolean, default: false },
      plan: { type: String, enum: ["free", "monthly", "yearly"], default: "free" },
      startDate: { type: Date },
      endDate: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);













// const mongoose = require("mongoose");

// const userSchema = mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Please add a name"],
//     },
//     email: {
//       type: String,
//       required: [true, "Please add an email"],
//       unique: true,
//       match: [
//         /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
//         "Please add a valid email",
//       ],
//     },
//     password: {
//       type: String,
//       required: [true, "Please add a password"],
//       minlength: [6, "Password must be at least 6 characters"],
//     },
//     gender: {
//       type: String,
//       enum: ["male", "female", "other"],
//       required: [true, "Please add a gender"],
//     },
//     code: {
//       type: String,
//       default: "",
//     },
//     image: {
//       type: String,
//       default: "https://example.com/default-avatar.png",
//     },

//     // 🔥 subscription
//     subscription: {
//       isActive: {
//         type: Boolean,
//         default: false,
//       },
//       plan: {
//         type: String,
//         enum: ["free", "monthly", "yearly"],
//         default: "free",
//       },
//       startDate: {
//         type: Date,
//       },
//       endDate: {
//         type: Date,
//       },
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("User", userSchema);
