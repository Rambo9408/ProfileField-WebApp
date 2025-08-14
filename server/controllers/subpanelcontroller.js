const SubPanel = require("../models/subpanel");
const PanelType = require("../models/paneltype");

const addSubPanel = async (req, res) => {
    try {
        const data = req.body;

        if (!data.subPanelName || data.subPanelName.trim() === '') {
            return res.status(400).send({ message: "SubPanel Name is required." });
        }

        const panel = await PanelType.findById(data.panelId);
        if (!panel) {
            return res.status(404).send({ message: "Panel not found." });
        }

        const subPanelCount = await SubPanel.countDocuments();

        const subPanel = new SubPanel({
            subPanelName: data.subPanelName.trim(),
            fieldId: data.fieldId || [],
            panelId: data.panelId,
            orderId: subPanelCount + 1
        });

        const savedSubPanel = await subPanel.save();

        panel.subpanelId.push(savedSubPanel._id);
        await panel.save();

        const populatedSubPanel = await SubPanel.findById(savedSubPanel._id).populate('fieldId').populate('panelId')

        res.status(201).json({
            message: "SubPanel added successfully.",
            data: populatedSubPanel
        });

    } catch (err) {
        console.error('Error adding subpanel:', err);
        res.status(500).send({
            message: err.message || "Some error occurred while creating the subpanel."
        });
    }
};

const updateSubPanel = async (req, res) => {
    try {
        const id = req.params.id;
        const { subPanelName, panelId, fieldId, orderId } = req.body;

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).send({ message: "Data to update cannot be empty." });
        }

        const existingSubPanel = await SubPanel.findById(id);
        if (!existingSubPanel) {
            return res.status(404).send({ message: `Cannot update subpanel with ID ${id}. SubPanel not found.` });
        }

        existingSubPanel.subPanelName = subPanelName ?? existingSubPanel.subPanelName;
        existingSubPanel.fieldId = fieldId ?? existingSubPanel.fieldId;
        existingSubPanel.orderId = orderId ?? existingSubPanel.orderId;
        existingSubPanel.panelId = panelId ?? existingSubPanel.panelId;

        const updatedSubPanel = await existingSubPanel.save();
        const populatedSubPanel = await SubPanel.findById(updatedSubPanel._id).populate('fieldId').populate('panelId');

        res.status(200).json({
            message: "SubPanel updated successfully.",
            data: populatedSubPanel
        });
    } catch (err) {
        console.error("Update error:", err);
        res.status(500).send({ message: err.message || "Error updating subpanel." });
    }
}

const deleteSubPanel = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedSubPanel = await SubPanel.findByIdAndDelete(id);

        if (!deletedSubPanel) {
            return res.status(404).send({ message: `SubPanel with ID ${id} not found.` });
        }

        res.status(200).json({
            message: "SubPanel deleted successfully.",
            data: deletedSubPanel
        });
    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).send({ message: err.message || "Error deleting subpanel." });
    }
};

const getSubPanel = async (req, res) => {
    try {
        const id = req.params.id;
        if (id) {
            const subPanel = await SubPanel.findById(id).populate('fieldId').populate('panelId');
            if (!subPanel) {
                return res.status(404).send({ message: `SubPanel with ID ${id} not found.` });
            }
            res.status(200).json({
                message: "SubPanel retrieved successfully.",
                data: subPanel
            });
            return;
        } else {
            // If no ID is provided, return all subpanels
            const subPanels = await SubPanel.find().populate('fieldId').populate('panelId');
            res.status(200).json(subPanels);
        }
    } catch (err) {
        console.error("Error retrieving subpanels:", err);
        res.status(500).send({ message: err.message || "Error retrieving subpanels." });
    }
};

const getSubPanelsByPanelId = async (req, res) => {
    try {
        const panelId  = req.params.id;
        
        const subPanels = await SubPanel.find({ panelId })
            .populate('fieldId');

        if (!subPanels.length) {
            return res.status(404).json({
                message: `No subpanels found for panel ID ${panelId}`
            });
        }

        res.status(200).json({
            message: "Subpanels retrieved successfully.",
            data: subPanels
        });
    } catch (err) {
        console.error("Error retrieving subpanels:", err);
        res.status(500).json({ message: err.message || "Error retrieving subpanels." });
    }
};


module.exports = {
    addSubPanel,
    updateSubPanel,
    deleteSubPanel,
    getSubPanel,
    getSubPanelsByPanelId
};