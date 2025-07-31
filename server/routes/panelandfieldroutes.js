const express =  require('express');
const router = express.Router();
const Fieldtypecontroller = require('../controllers/fieldtypecontroller');
const Panelcontroller = require('../controllers/panelcontroller');

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

module.exports = router;