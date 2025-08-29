const PanelType = require('../models/paneltype');
const SubPanel = require('../models/subpanel');
const fs = require("fs");
const path = require("path");
const ContextBlock = require("../models/contextblock");

const getContextBlock = async (req, res) => {
    try {
        const { panelId, subPanelId } = req.query;
        console.log(req.query);
        
        if (!panelId) {
            return res.status(400).json({ message: "Panel ID is required" });
        }

        // Build query dynamically based on available params
        const query = { panelId: panelId };

        if (subPanelId) query.subPanel = subPanelId;

        const contextBlocks = await ContextBlock.find(query).sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Context blocks fetched successfully",
            data: contextBlocks,
        });
    } catch (error) {
        console.error("Error fetching context blocks:", error);

        return res.status(500).json({
            message: "Error fetching context blocks",
            error: error.message,
        });
    }
};


const saveContextBlock = async (req, res) => {
    try {
        const { panelId, subPanel, content, volunteerAccess, attachmentFileNames, includeAttachments } = req.body;
        console.log(req.body);
        console.log(req.files);

        const panelExists = await PanelType.findById(panelId);
        if (!panelExists) {
            return res.status(404).json({ message: "Panel not found" });
        }

        if (subPanel) {
            const subPanelExists = await SubPanel.findById(subPanel);
            if (!subPanelExists) {
                return res.status(404).json({ message: "SubPanel not found" });
            }
        }

        let attachments = [];

        if (req.files && req.files.length > 0) {
            attachments = req.files.map((file, index) => {
                let fileName = '';

                if (Array.isArray(req.body.attachmentFileNames)) {
                    fileName = req.body.attachmentFileNames[index];
                } else {
                    fileName = req.body.attachmentFileNames || file.originalname;
                }

                return {
                    fileName: fileName,
                    originalFileName: file.originalname,
                    fileType: file.mimetype,
                    fileSize: file.size,
                    filePath: `/uploads/${file.filename}`
                };
            });
        }


        const newBlock = new ContextBlock({
            panelId,
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

const updateContextBlock = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid ContextBlock ID format." });
        }

        const {
            panel,
            subPanel,
            content,
            volunteerAccess,
            attachmentFileNames,
            includeAttachments
        } = req.body;

        // Check if context block exists
        const contextBlock = await ContextBlock.findById(id);
        if (!contextBlock) {
            return res.status(404).json({ message: "ContextBlock not found." });
        }

        // Validate panel
        const panelExists = await PanelType.findById(panel);
        if (!panelExists) {
            return res.status(404).json({ message: "Panel not found" });
        }

        // Validate subpanel (optional)
        if (subPanel) {
            const subPanelExists = await SubPanel.findById(subPanel);
            if (!subPanelExists) {
                return res.status(404).json({ message: "SubPanel not found" });
            }
        }

        let attachments = contextBlock.attachments || [];

        // If new files are uploaded, update attachments
        if (req.files && req.files.length > 0) {
            // Delete old files if they exist
            if (attachments.length > 0) {
                attachments.forEach(file => {
                    if (file.filePath) {
                        const filePath = path.join(__dirname, "..", file.filePath);
                        if (fs.existsSync(filePath)) {
                            fs.unlinkSync(filePath);
                        }
                    }
                });
            }

            // Replace with new attachments
            attachments = req.files.map((file, index) => {
                let fileName = '';

                if (Array.isArray(attachmentFileNames)) {
                    fileName = attachmentFileNames[index];
                } else {
                    fileName = attachmentFileNames || file.originalname;
                }

                return {
                    fileName: fileName,
                    originalFileName: file.originalname,
                    fileType: file.mimetype,
                    fileSize: file.size,
                    filePath: `/uploads/${file.filename}`
                };
            });
        }

        // Update fields
        contextBlock.panel = panel;
        contextBlock.subPanel = subPanel || null;
        contextBlock.content = content;
        contextBlock.volunteerAccess = volunteerAccess;
        contextBlock.includeAttachments = includeAttachments;
        contextBlock.attachments = attachments;

        const updatedBlock = await contextBlock.save();

        return res.status(200).json({
            message: "Context block updated successfully",
            data: updatedBlock,
        });

    } catch (error) {
        console.error("Error updating context block:", error);
        return res.status(500).json({
            message: "Error updating context block",
            error: error.message,
        });
    }
};


module.exports = {
    getContextBlock,
    saveContextBlock,
    deleteContextBlock,
    updateContextBlock
};
