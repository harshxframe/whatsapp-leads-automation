import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema(
  {
    // ACCOUNT INFO
    ownerName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    businessName: { type: String, required: true },
    industry: { type: String, default: "COACHING" },

    // AI KNOWLEDGE & CONTROL
    businessContext: String, // Company history/USP
    businessDetails: String, // Detailed info
    services: String, // List of services

    aiSettings: {
      tone: { type: String, default: "professional" },
      language: { type: String, default: "hinglish" },
      responseStyle: { type: String, default: "short" },
    },

    conversionGoal: {
      type: String,
      enum: [
        "BOOK_DEMO",
        "BOOK_APPOINTMENT",
        "GET_QUOTE",
        "SCHEDULE_VISIT",
        "MAKE_PURCHASE",
      ],
      default: "BOOK_DEMO",
    },

    // WHATSAPP CONFIG
    whatsapp: {
      numberID: { type: String, required: true },
    },

    // STATIC ANALYTICS (For Dashboard Cards - Total Numbers)
    analytics: {
      totalMessages: { type: Number, default: 0 },
      leadsGenerated: { type: Number, default: 0 },
      conversions: { type: Number, default: 0 },
    },

    // AUTOMATION
    automation: {
      notifyOwner: { type: Boolean, default: true },
    },
    active: { type: Boolean, default: true },
    adminAllowed: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("Client", ClientSchema);
