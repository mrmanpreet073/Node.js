import mongoose from "mongoose";

const playerStatsSchema = new mongoose.Schema({

    playerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
        required: true,
        unique: true
    },

    matches: {
        type: Number,
        default: 0
    },

    runs: {
        type: Number,
        default: 0
    },

    wickets: {
        type: Number,
        default: 0
    },

    average: {
        type: Number,
        default: 0
    },

    strikeRate: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

export default mongoose.model(
    "PlayerStats",
    playerStatsSchema
);