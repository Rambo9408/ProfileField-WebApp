const SubPanel = require("../models/subpanel");

const addSubPanel = async (req, res) => {
    try {
        const { subpanelName, fieldId, panelTypeId } = req.body;

        if (!subpanelName || subpanelName.trim() === '') {
            return res.status(400).send({ message: "SubPanel Name is required." });
        }

        const subPanelCount = await SubPanel.countDocuments();

        const subPanel = new SubPanel({
            subpanelName: subpanelName.trim(),
            fieldId: fieldId || [],
            panelTypeId,
            orderId: subPanelCount + 1
        });

        const savedSubPanel = await subPanel.save();

        res.status(201).json({
            message: "SubPanel added successfully.",
            data: savedSubPanel
        });

    } catch (err) {
        console.error('Error adding subpanel:', err);
        res.status(500).send({
            message: err.message || "Some error occurred while creating the subpanel."
        });
    }
}

const updateSubPanel = async (req, res) => {
    try {
        const id = req.params.id;
        const { subpanelName, fieldId, orderId } = req.body;

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).send({ message: "Data to update cannot be empty." });
        }

        const existingSubPanel = await SubPanel.findById(id);
        if (!existingSubPanel) {
            return res.status(404).send({ message: `Cannot update subpanel with ID ${id}. SubPanel not found.` });
        }

        existingSubPanel.subpanelName = subpanelName ?? existingSubPanel.subpanelName;
        existingSubPanel.fieldId = fieldId ?? existingSubPanel.fieldId;
        existingSubPanel.orderId = orderId ?? existingSubPanel.orderId;

        const updatedSubPanel = await existingSubPanel.save();

        res.status(200).json({
            message: "SubPanel updated successfully.",
            data: updatedSubPanel
        });
    } catch (err) {
        console.error("Update error:", err);
        res.status(500).send({ message: err.message || "Error updating subpanel." });
    }
}

const dleteSubPanel = async (req, res) => {
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
        if(id){
            const subPanel = await SubPanel.findById(id).populate('fieldId').populate('panelTypeId');
            if (!subPanel) {
                return res.status(404).send({ message: `SubPanel with ID ${id} not found.` });
            }
            res.status(200).json({
                message: "SubPanel retrieved successfully.",
                data: subPanel
            });
            return;
        }else{
            // If no ID is provided, return all subpanels
            const subPanels = await SubPanel.find().populate('fieldId').populate('panelTypeId');
            res.status(200).json({
                message: "SubPanels retrieved successfully.",
                data: subPanels
            });
        }
    } catch (err) {
        console.error("Error retrieving subpanels:", err);
        res.status(500).send({ message: err.message || "Error retrieving subpanels." });
    }
};

module.exports = {
    addSubPanel,
    updateSubPanel,
    dleteSubPanel,
    getSubPanel
};