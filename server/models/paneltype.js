const mongoose = require("mongoose");

const PanelTypeSchema = new mongoose.Schema(
    {
        panelName: {
            type: String,
            required: true,
            trim: true,
        },
        fieldId: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "FieldType",
            required: false,
        }],
        subpanelId: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubPanel",
            required: false,
        }],
        orderId: {
            type: Number,
            required: false
        },
        isRemovable: {
            type: Boolean,
            default: true,
            required: false
        },
        isPanelOpen: {
            type: Boolean,
            default: true,
            required: false
        },
        isShownOnImport: {
            type: Boolean,
            default: true,
            required: false
        },
        hideFromVolunteers: {
            type: Boolean,
            default: false,
            required: false
        }
    },
    { timestamps: true }
);

const PanelTypes = mongoose.model("PanelType", PanelTypeSchema);

module.exports = PanelTypes;
