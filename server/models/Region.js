const mongoose = require('mongoose');

const regionSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true
    },
    townVillage: {
      type: String,
      trim: true,
      default: ''
    },
    craftHeritage: {
      type: String,
      required: [true, 'Craft heritage description is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    image: {
      type: String,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index on state and district
regionSchema.index({ state: 1, district: 1 });

module.exports = mongoose.model('Region', regionSchema);
