const express =  require('express');
const router = express.Router();
const Fieldtypecontroller = require('../controllers/fieldtypecontroller');
const Panelcontroller = require('../controllers/panelcontroller');
const SubPanelcontroller = require('../controllers/subpanelcontroller');
const ContextBlockController = require('../controllers/contextblockcontroller');
const upload = require('../middleware/uploads');

//Panel routes
router.get('/panel', Panelcontroller.find);
router.get('/panel/:id', Panelcontroller.find);
router.post('/addPanel', Panelcontroller.addPanelType);
router.post('/addMultiplePanel', Panelcontroller.addMultiplePanels);
router.put('/updatePanelOrder', Panelcontroller.updatePanelOrder);
router.put('/updatePanel/:id', Panelcontroller.updatePanelType);
router.delete('/deletePanel/:id', Panelcontroller.deletePanelType);

//FieldType routes
router.get('/fields', Fieldtypecontroller.findField);
router.get('/fields/:id', Fieldtypecontroller.findField);
router.post('/addFields', Fieldtypecontroller.addFieldType);
router.post('/addMultipleFieldType', Fieldtypecontroller.addMultipleFieldTypes);
router.put('/updateFieldOrder', Fieldtypecontroller.updateFieldOrder);
router.put('/updateField/:id', Fieldtypecontroller.updateFieldType);
router.delete('/deleteField/:id', Fieldtypecontroller.deleteFieldType);

//Sub-Panel routes
router.get('/subPanel', SubPanelcontroller.getSubPanel);
router.get('/subPanel/:id', SubPanelcontroller.getSubPanel);
router.get('/subPanelbyPanelID/:id', SubPanelcontroller.getSubPanelsByPanelId);
router.post('/addSubPanel', SubPanelcontroller.addSubPanel);
// router.post('/addMultipleFieldType', SubPanelcontroller.);
// router.put('/updateFieldOrder', SubPanelcontroller.updateSubPanel);
router.put('/updateSubPanel/:id', SubPanelcontroller.updateSubPanel);
router.delete('/deleteSubPanel/:id', SubPanelcontroller.deleteSubPanel);

//contextBlock routes
router.post('/addContextBlock', upload.array("attachments", 5), ContextBlockController.saveContextBlock);
router.delete('/deleteContextBlock/:id', ContextBlockController.deleteContextBlock);

module.exports = router;