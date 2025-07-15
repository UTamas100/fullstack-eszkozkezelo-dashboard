const express = require('express');
const router = express.Router();
const Device = require('../models/device.model');

// Véletlen státusz generálása
function randomStatus()
{
    const statuses = [ 'active', 'error', 'inactive' ];
    return statuses[Math.floor(Math.random() * statuses.length)];
}

// GET /devices – Lista
router.get('/', async (req, res) => {
    try {
        const devices = await Device.find();

        // Frissített státuszok visszaadása minden híváskor
        const updatedDevices = await Promise.all(devices.map(async (device) => {
            device.status = randomStatus();
            await device.save();
            return device;
        }));

        res.json(updatedDevices);
    } catch (err) {
        res.status(500).json({ message : err.message });
    }
});

// POST /devices – Új eszköz
router.post('/', async (req, res) => {
    try {
        const device = new Device({
            name : req.body.name,
            type : req.body.type,
            ip : req.body.ip,
            location : req.body.location,
            status : randomStatus()
        });
        const newDevice = await device.save();
        res.status(201).json(newDevice);
    } catch (err) {
        res.status(400).json({ message : err.message });
    }
});

// DELETE /devices/:id – Törlés
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await Device.findByIdAndDelete(id);
        res.status(200).send({ message : 'Törölve' });
    } catch (error) {
        console.error('Törlés hiba:', error);
        res.status(500).send({ error : 'Törlés nem sikerült' });
    }
});

module.exports = router;
