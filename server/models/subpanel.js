const mongoose = require("mongoose");

const subPanelSchema = new mongoose.Schema(
    {
        subPanelName: {
            type: String,
            required: true,
            trim: true,
        },
        fieldId: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "FieldType",
            required: false,
        }],
        panelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PanelType",
            required: true,
        },
        orderId: {
            type: Number,
            required: false
        },
        fieldType: {
            type: String,
            required: false,
        },
    },
    { timestamps: true }
);

const SubPanel = mongoose.model("SubPanel", subPanelSchema);

module.exports = SubPanel;