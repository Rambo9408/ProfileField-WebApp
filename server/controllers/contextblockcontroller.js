const PanelType = require('../models/paneltype');
const SubPanel = require('../models/subpanel');
const fs = require("fs");
const path = require("path");
const ContextBlock = require("../models/contextblock");

// Save a new context block
const saveContextBlock = async (req, res) => {
    try {
        const { panel, subPanel, content, volunteerAccess, includeAttachments } = req.body;

        // ✅ Check if panel exists
        const panelExists = await PanelType.findById(panel);
        if (!panelExists) {
            return res.status(404).json({ message: "Panel not found" });
        }

        // ✅ Check if subpanel exists (if provided)
        if (subPanel) {
            const subPanelExists = await SubPanel.findById(subPanel);
            if (!subPanelExists) {
                return res.status(404).json({ message: "SubPanel not found" });
            }
        }

        // ✅ Handle uploaded attachments from multer (req.files)
        let attachments = [];
        if (req.files && req.files.length > 0) {
            attachments = req.files.map((file, index) => ({
                fileName: req.body.fileNames ? req.body.fileNames.split(',')[index] : file.originalname,
                originalFileName: file.originalname,
                fileType: file.mimetype,
                fileSize: file.size,
                filePath: `/uploads/${file.filename}`,
            }));
        }

        // ✅ Create new ContextBlock
        const newBlock = new ContextBlock({
            panel,
            subPanel: subPanel || null,
            content,
            volunteerAccess,
            includeAttachments,
            attachments,
        });

        const savedBlock = await newBlock.save();

        return res.status(201).json({
            message: "Context block saved successfully",
            data: savedBlock,
        });
    } catch (error) {
        console.error("Error saving context block:", error);

        return res.status(500).json({
            message: "Error saving context block",
            error: error.message,
        });
    }
};

const deleteContextBlock = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                message: "Invalid ContextBlock ID format.",
            });
        }

        const contextBlock = await ContextBlock.findById(id);

        if (!contextBlock) {
            return res.status(404).json({
                message: `ContextBlock with ID ${id} not found.`,
            });
        }

        if (contextBlock.attachments && contextBlock.attachments.length > 0) {
            contextBlock.attachments.forEach((file) => {
                if (file.filePath) {
                    const filePath = path.join(__dirname, "..", file.filePath);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath); // Delete file from server
                    }
                }
            });
        }

        await ContextBlock.findByIdAndDelete(id);

        return res.status(200).json({
            message: "ContextBlock deleted successfully.",
            data: contextBlock,
        });
    } catch (error) {
        console.error("Error deleting context block:", error);

        return res.status(500).json({
            message: "Error deleting context block.",
            error: error.message,
        });
    }
};


module.exports = {
    saveContextBlock,
    deleteContextBlock,
};
