const PanelTypes = require('../models/paneltype');
const SubPanel = require('../models/subpanel');
const FieldType = require('../models/fieldtype');

// Add a single panel with auto-incremented orderId
const addPanelType = async (req, res) => {
    try {
        const { contentType, panelName, fieldId, subpanelId, isPanelOpen, hideFromVolunteers } = req.body;
        console.log("Request Body: ", req.body);

        if (!panelName || panelName.trim() === '') {
            return res.status(400).send({ message: "Panel Name is required." });
        }

        const existingPanel = await PanelTypes.findOne({ panelName: panelName.trim() });

        if (existingPanel) {
            return res.status(400).json({ message: "Panel name already exists. Please choose a different name." });
        }

        const panelCount = await PanelTypes.countDocuments();

        const panelType = new PanelTypes({
            panelName: panelName.trim(),
            fieldId: fieldId || [],
            orderId: panelCount + 1,
            subpanelId: subpanelId || [],
            isPanelOpen: isPanelOpen || false,
            hideFromVolunteers: hideFromVolunteers || false
        });

        const savedPanel = await panelType.save();

        if (subpanelId && contentType === 'clone') {
            for (const subPanel of subpanelId) {
                const subPanelCount = await SubPanel.countDocuments();
                await new SubPanel({
                    subPanelName: subPanel.subPanelName.trim(),
                    fieldId: subPanel.fieldId || [],
                    panelId: savedPanel._id,
                    orderId: subPanelCount + 1
                }).save();
            }

        }

        res.status(201).json({
            message: "Panel added successfully.",
            data: savedPanel
        });

    } catch (err) {
        console.error('Error adding panel:', err);
        res.status(500).send({
            message: err.message || "Some error occurred while creating the panel."
        });
    }
};

// Update a panel
const updatePanelType = async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body;

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).send({ message: "Data to update cannot be empty." });
        }

        const existingPanel = await PanelTypes.findById(id);
        if (!existingPanel) {
            return res.status(404).send({ message: `Cannot update panel with ID ${id}. Panel not found.` });
        }

        // existingPanel.panelName = panelName ?? existingPanel.panelName;
        // existingPanel.fieldId = fieldId ?? existingPanel.fieldId;
        // existingPanel.orderId = orderId ?? existingPanel.orderId;

        Object.keys(updateData).forEach((key) => {
            if (updateData[key] !== '') {
                existingPanel[key] = updateData[key];
            }
        });

        const updatedPanel = await existingPanel.save();

        res.status(200).json({
            message: "Panel updated successfully.",
            data: updatedPanel
        });
    } catch (err) {
        console.error("Update error:", err);
        res.status(500).send({ message: err.message || "Error updating panel." });
    }
};

// Delete a panel and reassign orderIds
const deletePanelType = async (req, res) => {
    try {
        const id = req.params.id;
        const findPanel = await PanelTypes.findById(id);

        if (findPanel) {
            const findSubPanels = await SubPanel.find({ panelId: findPanel._id });
            const findFieldsInPanel = await FieldType.find({ panelId: findPanel._id });

            if (findSubPanels.length > 0) {
                const subPanelIds = findSubPanels.map(sp => sp._id);
                await SubPanel.deleteMany({ _id: { $in: subPanelIds } });
            }

            if (findFieldsInPanel.length > 0) {
                const fieldIds = findFieldsInPanel.map(f => f._id);
                await FieldType.deleteMany({ _id: { $in: fieldIds } });
            }
        }

        const deletedPanel = await PanelTypes.findByIdAndDelete(id);

        if (!deletedPanel) {
            return res.status(404).send({ message: `Cannot delete panel with ID ${id}. Panel not found.` });
        }

        // 🧹 Reorder remaining panels
        const remainingPanels = await PanelTypes.find().sort({ orderId: 1 });
        for (let i = 0; i < remainingPanels.length; i++) {
            remainingPanels[i].orderId = i + 1;
            await remainingPanels[i].save();
        }

        res.status(200).json({ message: "Panel deleted and order updated successfully." });
    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).send({
            message: `Could not delete panel with ID ${req.params.id}`,
        });
    }
};

// Add multiple panels and auto-assign orderId for each
const addMultiplePanels = async (req, res) => {
    try {
        const panels = req.body;

        if (!Array.isArray(panels) || panels.length === 0) {
            return res.status(400).send({ message: "Request body must be a non-empty array of panels." });
        }

        const existingCount = await PanelTypes.countDocuments();

        const panelsToInsert = panels.map((panel, index) => ({
            panelName: panel.panelName.trim(),
            fieldId: panel.fieldId || [],
            orderId: existingCount + index + 1
        }));

        const insertedPanels = await PanelTypes.insertMany(panelsToInsert);

        res.status(201).json({
            message: "Panels added successfully.",
            data: insertedPanels
        });
    } catch (err) {
        console.error("Insert many error:", err);
        res.status(500).send({
            message: err.message || "Some error occurred while adding panels."
        });
    }
};

// Find single or all panels
const find = async (req, res) => {
    try {
        const id = req.params.id;

        if (id) {
            const panel = await PanelTypes.findById(id)
                .populate("fieldId", " -createdAt -updatedAt -__v")
                .populate("subpanelId", " -createdAt -updatedAt -__v");

            if (!panel) {
                return res.status(404).send({ message: `No panel found with ID ${id}` });
            }

            return res.status(200).json(panel);
        }

        const allPanels = await PanelTypes.find()
            .sort({ orderId: 1 })
            .populate("fieldId", " -createdAt -updatedAt -__v")
            .populate("subpanelId", " -createdAt -updatedAt -__v");

        res.status(200).json(allPanels);
    } catch (err) {
        console.error("Find error:", err);
        res.status(500).send({ message: err.message || "Error retrieving panel(s)." });
    }
};

const updatePanelOrder = async (req, res) => {
    try {
        const panels = req.body;

        if (!Array.isArray(panels) || panels.length === 0) {
            return res.status(400).send({ message: "Request body must be a non-empty array of panels." });
        }

        // Validate that all panels have an orderId
        for (const panel of panels) {
            if (typeof panel.orderId !== 'number') {
                return res.status(400).send({ message: "Each panel must have a valid orderId." });
            }
        }

        // Update each panel's orderId
        const updatePromises = panels.map(panel => {
            return PanelTypes.findByIdAndUpdate(panel._id, { orderId: panel.orderId }, { new: true });
        });

        const updatedPanels = await Promise.all(updatePromises);

        res.status(200).json({
            message: "Panel order updated successfully.",
            data: updatedPanels
        });

    } catch (err) {
        console.error("Find error:", err);
        res.status(500).send({ message: err.message || "Error retrieving panel(s)." });
    }
}

module.exports = {
    addPanelType,
    updatePanelType,
    deletePanelType,
    addMultiplePanels,
    find,
    updatePanelOrder
};
