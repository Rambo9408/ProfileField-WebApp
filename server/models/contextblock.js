const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },
  originalFileName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  filePath: {
    type: String, // storing files on server to save path
    default: null
  }
}, { _id: false });

const contextBlockSchema = new mongoose.Schema({
  panelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PanelType", // Your panel model reference
    required: true
  },
  subPanel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubPanel", // Optional subpanel reference
    required: false
  },
  content: {
    type: String, // HTML content from CKEditor
    required: true
  },
  volunteerAccess: {
    type: Boolean,
    default: false
  },
  includeAttachments: {
    type: Boolean,
    default: false
  },
  attachments: {
    type: [attachmentSchema],
    default: []
  }
}, { timestamps: true });

const ContextBlock = mongoose.model("ContextBlock", contextBlockSchema);

module.exports = ContextBlock;