// routes/pactState.js
const express = require("express");
const router = express.Router();
const prisma = require("./db");

router.post("/_pactState", async (req, res) => {
  const { state } = req.body;

  try {
    switch (state) {
      // MedicoApp → Licencias: crear licencia válida predecible
      case "issued license days>0 is creatable":
        await prisma.license.deleteMany({ folio: "L-95102" });
        await prisma.license.create({
          data: {
            folio: "L-95102", // folio esperado por el consumer test
            patientId: "11111111-1",
            doctorId: "D-123",
            diagnosis: "cough",
            startDate: new Date("2025-09-01T00:00:00.000Z"),
            days: 7,
            status: "issued",
          },
        });
        break;

      // PortalPaciente → Licencias: paciente con licencia existente
      case "patient 11111111-1 has issued license folio L-1001":

      await prisma.license.deleteMany({ folio: "L-1001" });

        await prisma.license.create({
          data: {
            folio: "L-1001",
            patientId: "11111111-1",
            doctorId: "D-123",
            diagnosis: "cough",
            startDate: new Date("2025-09-01T00:00:00.000Z"),
            days: 7,
            status: "issued",
          },
        });
        break;

      // PortalPaciente → Licencias: paciente sin licencias
      case "no licenses for patient 22222222-2":
        await prisma.license.deleteMany({ patientId: "22222222-2" });
        break;

      // ValidadorAseguradora → Licencias: licencia inexistente
      case "license L-404 does not exist":
        await prisma.license.deleteMany({ folio: "L-404" });
        break;

      default:
        return res.status(400).send("unknown state");
    }

    res.status(200).send("state set");
  } catch (e) {
    console.error("Error setting provider state:", e);
    res.status(500).send("error preparing state");
  }
});

module.exports = router;
