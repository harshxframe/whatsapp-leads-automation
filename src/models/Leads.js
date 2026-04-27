import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    
    // CUSTOMER DATA
    name: String,
    phone: { type: String, required: true },
    interest: String, // JEE, NEET, or 2BHK
    extractedData: { type: Map, of: String }, // For any extra info AI finds
    
    // SALES FUNNEL
    stage: {
        type: String,
        enum: ['NEW', 'INTERESTED', 'HOT', 'CLOSED'],
        default: 'NEW'
    },
    goalReached: { type: Boolean, default: false }, 

    // AI MEMORY (Sliding Window)
    chatHistory: [
        {
            role: { type: String, enum: ['user', 'model'] },
            text: String,
            timestamp: { type: Date, default: Date.now }
        }
    ],

    // SYSTEM FLAGS
    isBotActive: { type: Boolean, default: true }, 
    lastInteraction: { type: Date, default: Date.now }
}, { timestamps: true });

LeadSchema.index({ clientId: 1, phone: 1 }, { unique: true });

export default mongoose.model("Lead", LeadSchema);