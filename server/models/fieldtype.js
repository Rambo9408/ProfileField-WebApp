const mongoose = require("mongoose");

const FieldTypeSchema = new mongoose.Schema(
    {
        fieldName: {
            type: String,
            required: true,
            trim: true,
        },
        panelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PanelType",
            required: false,
        },
        orderId: {
            type: Number,
            required: false
        },
        colId: {
            type: Number,
            enum: [0, 1],
            required: false
        }
    },
    { timestamps: true }
);

const FieldTypes = mongoose.model("FieldType", FieldTypeSchema);

module.exports = FieldTypes;
