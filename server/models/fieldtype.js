const mongoose = require("mongoose");

const FieldTypeSchema = new mongoose.Schema(
    {
        fieldName: {
            type: String,
            required: true,
            trim: true,
        },
        fieldDescription: {
            type: String,
            required: false,
            trim: true,
        },
        fieldType: {
            type: String,
            required: false,
        },
        panelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PanelType",
            required: true,
        },
        subpanelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubPanel",
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
        },
        isDraggable: {
            type: Boolean,
            default: false,
            required: false
        },
        colWidth: {
            type: Number,
            required: false,
            default: 100
        }
    },
    { timestamps: true }
);

const FieldTypes = mongoose.model("FieldType", FieldTypeSchema);

module.exports = FieldTypes;
