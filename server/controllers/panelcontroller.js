const PanelTypes = require('../models/paneltype');

// Add a single panel with auto-incremented orderId
const addPanelType = async (req, res) => {
    try {
        const { panelName, fieldId } = req.body;

        if (!panelName || panelName.trim() === '') {
            return res.status(400).send({ message: "Panel Name is required." });
        }

        const panelCount = await PanelTypes.countDocuments();

        const panelType = new PanelTypes({
            panelName: panelName.trim(),
            fieldId: fieldId || [],
            orderId: panelCount + 1
        });

        const savedPanel = await panelType.save();

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
        const { panelName, fieldId, orderId } = req.body;

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).send({ message: "Data to update cannot be empty." });
        }

        const existingPanel = await PanelTypes.findById(id);
        if (!existingPanel) {
            return res.status(404).send({ message: `Cannot update panel with ID ${id}. Panel not found.` });
        }

        existingPanel.panelName = panelName ?? existingPanel.panelName;
        existingPanel.fieldId = fieldId ?? existingPanel.fieldId;
        existingPanel.orderId = orderId ?? existingPanel.orderId;

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
                .populate("fieldId", "fieldName colId orderId");

            if (!panel) {
                return res.status(404).send({ message: `No panel found with ID ${id}` });
            }

            return res.status(200).json(panel);
        }

        const allPanels = await PanelTypes.find()
            .sort({ orderId: 1 })
            .populate("fieldId", "fieldName colId orderId");

        res.status(200).json(allPanels);
    } catch (err) {
        console.error("Find error:", err);
        res.status(500).send({ message: err.message || "Error retrieving panel(s)." });
    }
};

module.exports = {
    addPanelType,
    updatePanelType,
    deletePanelType,
    addMultiplePanels,
    find
};
