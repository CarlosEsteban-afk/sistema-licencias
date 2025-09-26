const express = require('express');
const router = express.Router();
const prisma = require('./db');

// POST /licenses
router.post('/licenses', async (req, res) => {
  const { patientId, doctorId, diagnosis, startDate, days } = req.body;

  if (days <= 0) return res.status(400).json({ error: "INVALID_DAYS" });

  const folio = `L-${Math.floor(Math.random() * 100000)}`;
  const license = await prisma.license.create({
    data: {
      folio,
      patientId,
      doctorId,
      diagnosis,
      startDate: new Date(startDate),
      days,
      status: "issued"
    }
  });

  res.status(201).json(license);
});

// GET /licenses/:folio
router.get('/licenses/:folio', async (req, res) => {
  const license = await prisma.license.findUnique({
    where: { folio: req.params.folio }
  });
  if (!license) return res.status(404).json({ error: "NOT_FOUND" });
  res.json(license);
});

// GET /licenses?patientId=
router.get('/licenses', async (req, res) => {
  const { patientId } = req.query;
  const licenses = await prisma.license.findMany({
    where: { patientId }
  });
  res.json(licenses);
});

// GET /licenses/:folio/verify
router.get('/licenses/:folio/verify', async (req, res) => {
  const license = await prisma.license.findUnique({
    where: { folio: req.params.folio }
  });
  if (!license || license.status !== 'issued') return res.status(404).json({ valid: false });
  res.json({ valid: true });
});

module.exports = router;
