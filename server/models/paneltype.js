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
        orderId: {
            type: Number,
            required: false
        }
    },
    { timestamps: true }
);

const PanelTypes = mongoose.model("PanelType", PanelTypeSchema);

module.exports = PanelTypes;
