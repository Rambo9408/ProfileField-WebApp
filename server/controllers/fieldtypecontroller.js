const FieldType = require('../models/fieldtype');
const PanelType = require('../models/paneltype');
const SubPanel = require('../models/subpanel');

const addFieldType = async (req, res) => {
    try {
        const {
            fieldName,
            fieldDescription,
            fieldType,
            selectedColumnWidth = 100,
            selectedPanelId,
            selectedSubPanel
        } = req.body;

        if (!fieldName || fieldName.trim() === '') {
            return res.status(400).json({ message: "Field name is required." });
        }
        if (!fieldType) {
            return res.status(400).json({ message: "Field type is required." });
        }
        if (!selectedPanelId) {
            return res.status(400).json({ message: "Panel ID is required." });
        }

        // Fetch the panel and populate fieldId
        const panel = await PanelType.findById(selectedPanelId).populate('fieldId');
        if (!panel) {
            return res.status(404).json({ message: "Panel not found." });
        }

        const existingFieldCount = panel.fieldId.length;
        const lastColId = existingFieldCount > 0
            ? panel.fieldId[existingFieldCount - 1].colId
            : 0;

        let subPanelId = undefined;
        if (selectedSubPanel && selectedSubPanel._id) {
            subPanelId = selectedSubPanel._id;
        }

        // Create and save new field
        const newField = new FieldType({
            fieldName: fieldName.trim(),
            fieldDescription: fieldDescription?.trim() || '',
            fieldType,
            panelId: selectedPanelId,
            subpanelId: subPanelId,
            orderId: existingFieldCount + 1,
            colId: lastColId === 0 ? 1 : 0,
            isDraggable: false,
            colWidth: selectedColumnWidth || 100
        });


        const savedField = await newField.save();

        // Add field to panel
        panel.fieldId.push(savedField._id);
        await panel.save();

        // Add field to subpanel(s) if applicable
        if (selectedPanelId) {
            const subPanels = await SubPanel.find({ panelId: selectedPanelId });
            for (const subPanel of subPanels) {
                subPanel.fieldId.push(savedField._id);
                await subPanel.save();
            }
        }

        return res.status(201).json({
            message: "Field added and linked to panel successfully.",
            data: savedField
        });

    } catch (err) {
        console.error('Error adding field:', err);
        return res.status(500).json({
            message: err.message || "Error adding field."
        });
    }
};

const addMultipleFieldTypes = async (req, res) => {
    try {
        const { panelId, fields } = req.body;

        if (!Array.isArray(fields) || fields.length === 0) {
            return res.status(400).send({ message: "An array of fields is required." });
        }

        const panel = await PanelType.findById(panelId);

        if (!panel) {
            return res.status(404).send({ message: "Panel not found." });
        }

        // Get existing count to calculate proper orderId
        let orderStart = await FieldType.countDocuments({ panelId });

        const savedFields = [];

        for (const field of fields) {
            const { fieldName, colId } = field;

            if (!fieldName || typeof fieldName !== 'string' || fieldName.trim() === '') continue;

            const newField = new FieldType({
                fieldName: fieldName.trim(),
                panelId,
                colId,
                orderId: ++orderStart
            });

            const saved = await newField.save();

            // Add to panel.fieldId
            panel.fieldId.push(saved._id);
            savedFields.push(saved);
        }

        await panel.save();

        res.status(201).json({
            message: "Multiple fields added and linked to panel successfully.",
            data: savedFields
        });
    } catch (err) {
        console.error('Error adding multiple fields:', err);
        res.status(500).send({
            message: err.message || "Error adding multiple fields."
        });
    }
};

const findField = async (req, res) => {
    try {
        const id = req.params.id;

        if (id) {
            const field = await FieldType.findById(id).populate('panelId').populate('subpanelId');
            if (!field) {
                return res.status(404).send({ message: `No field found with ID ${id}` });
            }

            return res.status(200).json(field);
        }

        const allFields = await FieldType.find().populate('panelId').populate('subpanelId');

        res.status(200).json(allFields);
    } catch (err) {
        console.error("Find error:", err);
        res.status(500).send({ message: err.message || "Error retrieving field(s)." });
    }
};

const updateFieldType = async (req, res) => {
    try {
        const { id } = req.params;

        const { fieldName, fieldDescription, colId, orderId } = req.body;

        const field = await FieldType.findById(id);
        if (!field) {
            return res.status(404).send({ message: `No field found with ID ${id}` });
        }

        if (fieldName !== undefined) field.fieldName = fieldName.trim();
        if (colId !== undefined) field.colId = colId;
        if (orderId !== undefined) field.orderId = orderId;
        if (fieldDescription !== undefined) field.fieldDescription = fieldDescription;

        const updated = await field.save();

        res.status(200).json({
            message: "Field updated successfully.",
            data: updated
        });
    } catch (err) {
        console.error("Error updating field:", err);
        res.status(500).send({ message: err.message || "Error updating field." });
    }
};

const deleteFieldType = async (req, res) => {
    try {
        const { id } = req.params;

        const field = await FieldType.findById(id);
        if (!field) {
            return res.status(404).send({ message: `No field found with ID ${id}` });
        }

        // Remove reference from Panel
        await PanelType.findByIdAndUpdate(field.panelId, {
            $pull: { fieldId: field._id }
        });

        // Delete reference from subpanel
        await SubPanel.findByIdAndUpdate(field.panelId, {
            $pull: { fieldId: field._id }
        });

        // Delete the field itself
        await FieldType.findByIdAndDelete(id);

        res.status(200).json({
            message: "Field deleted successfully."
        });
    } catch (err) {
        console.error("Error deleting field:", err);
        res.status(500).send({ message: err.message || "Error deleting field." });
    }
};

const updateFieldOrder = async (req, res) => {
    try {
        const fields = req.body;

        if (!Array.isArray(fields) || fields.length === 0) {
            return res.status(400).send({ message: "An array of fields with orderId is required." });
        }

        for (const field of fields) {
            const { _id, orderId, colId } = field;

            if (!_id || orderId === undefined || colId === undefined) continue;

            await FieldType.findByIdAndUpdate(_id, { orderId, colId });
        }

        const updatedField = await FieldType.find();
        res.status(200).json({
            message: "Field order updated successfully.",
            updatedField
        });

    } catch (err) {
        console.error("Error deleting field:", err);
        res.status(500).send({ message: err.message || "Error deleting field." });
    }
}

module.exports = {
    addFieldType,
    findField,
    addMultipleFieldTypes,
    updateFieldType,
    deleteFieldType,
    updateFieldOrder
};
