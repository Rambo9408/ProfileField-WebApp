const mongoose = require("mongoose");

const subPanelSchema = new mongoose.Schema(
    {
        subpanelName: {
            type: String,
            required: true,
            trim: true,
        },
        fieldId: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "FieldType",
            required: false,
        }],
        panelTypeId: {
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