// import mongoose from "mongoose";

// const LeadSchema = new mongoose.Schema(
//   {
//     clientId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Client",
//       required: true,
//     },

//     // CUSTOMER DATA
//     name: String,
//     phone: { type: String, required: true },
//     interest: String,
//     extractedData: {
//       type: Map,
//       of: String,
//       validate: {
//         validator: function (v) {
//           return v.size <= 15; // 15 items se zyada allow nahi karega
//         },
//         message: "extractedData cannot have more than 15 items.",
//       },
//     },
//     // SALES FUNNEL
//     stage: {
//       type: String,
//       enum: ["NEW", "INTERESTED", "HOT", "CLOSED"],
//       default: "NEW",
//     },
//     goalReached: { type: Boolean, default: false },

//     // AI MEMORY
//     chatHistory: [
//       {
//         role: { type: String, enum: ["user", "model"] },
//         text: String,
//         timestamp: { type: Date, default: Date.now },
//       },
//     ],

//     // SYSTEM FLAGS
//     isBotActive: { type: Boolean, default: true },
//     lastInteraction: { type: Date, default: Date.now },
//     isEmailSentOnHot: { type: Boolean, default: false },
//     isEmailSentOnClosed: { type: Boolean, default: false },

//     // TTL FIELD
//     expireAt: {
//       type: Date,
//       required: true,
//     },
//   },
//   { timestamps: true },
// );

// // Unique constraint
// LeadSchema.index({ clientId: 1, phone: 1 }, { unique: true });

// // TTL index
// LeadSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

// export default mongoose.model("Lead", LeadSchema);

import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    // CUSTOMER DATA
    name: { type: String, default: "" },
    phone: { type: String, required: true },
    interest: { type: String, default: "" },

    extractedData: {
      type: Map,
      of: String,
      default: new Map(), // ✅ important
      validate: {
        validator: function (v) {
          return v.size <= 15;
        },
        message: "extractedData cannot have more than 15 items.",
      },
    },

    // SALES FUNNEL
    stage: {
      type: String,
      enum: ["NEW", "INTERESTED", "HOT", "CLOSED"],
      default: "NEW",
    },

    goalReached: { type: Boolean, default: false },

    // AI MEMORY
    chatHistory: {
      type: [
        {
          role: { type: String, enum: ["user", "model"] },
          text: { type: String, default: "" },
        },
      ],
      default: [], // important
    },

    // SYSTEM FLAGS
    isBotActive: { type: Boolean, default: true },

    lastInteraction: {
      type: Date,
      default: Date.now,
    },

    isEmailSentOnHot: { type: Boolean, default: false },
    isEmailSentOnClosed: { type: Boolean, default: false },

    // TTL FIELD
    expireAt: {
      type: Date,
      required: true,
      default: () => {
        const d = new Date();
        d.setMonth(d.getMonth() + 2);
        return d;
      },
    },
  },
  { timestamps: true }
);

// Unique constraint
LeadSchema.index({ clientId: 1, phone: 1 }, { unique: true });

// TTL index
LeadSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Lead", LeadSchema);