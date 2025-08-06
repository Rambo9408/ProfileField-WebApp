const express =  require('express');
const router = express.Router();
const Fieldtypecontroller = require('../controllers/fieldtypecontroller');
const Panelcontroller = require('../controllers/panelcontroller');
const SubPanelcontroller = require('../controllers/subpanelcontroller');

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
router.get('/field/:id', Fieldtypecontroller.findField);
router.post('/addFields', Fieldtypecontroller.addFieldType);
router.post('/addMultipleFieldType', Fieldtypecontroller.addMultipleFieldTypes);
router.put('/updateFieldOrder', Fieldtypecontroller.updateFieldOrder);
router.put('/updateField/:id', Fieldtypecontroller.updateFieldType);
router.delete('/deleteField/:id', Fieldtypecontroller.deleteFieldType);

//Sub-Panel routes
router.get('/subPanel', SubPanelcontroller.getSubPanel);
router.get('/subPanel/:id', SubPanelcontroller.getSubPanel);
router.post('/addSubPanel', SubPanelcontroller.addSubPanel);
// router.post('/addMultipleFieldType', SubPanelcontroller.);
// router.put('/updateFieldOrder', SubPanelcontroller.updateSubPanel);
router.put('/updateSubPanel/:id', SubPanelcontroller.updateSubPanel);
router.delete('/deleteSubPanel/:id', SubPanelcontroller.deleteSubPanel);

module.exports = router;