const router = require('express').Router();
const auth = require('./auth')
const child = require('./child')
const vaccineList = require('./vaccinelist')
const vaccine = require('./vaccines')
const doctors = require('./doctor')

router.use('/auth', auth);
router.use('/children', child);
router.use('/vaccine-list', vaccineList);
router.use('/vaccines', vaccine);
router.use('/doctors',doctors);

module.exports = router;
