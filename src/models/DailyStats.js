import mongoose from "mongoose";

const DailyStatsSchema = new mongoose.Schema({
    clientId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Client', 
        required: true 
    },

    // Use Date instead of String
    date: { 
        type: Date, 
        required: true 
    },
    
    metrics: {
        newLeads: { type: Number, default: 0 },
        conversions: { type: Number, default: 0 },
        messagesHandled: { type: Number, default: 0 }
    }
}, { timestamps: true });


// Unique per client per day
DailyStatsSchema.index({ clientId: 1, date: 1 }, { unique: true });


// TTL based on actual business date
DailyStatsSchema.index(
  { date: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 90 } // 90 days
);

export default mongoose.model("DailyStats", DailyStatsSchema);