const path = require("path");
const { Verifier } = require("@pact-foundation/pact");

const prisma = require("../../app/licencias/src/db");

const verifier = new Verifier({
  provider: "Licencias",
  providerBaseUrl: "http://licencias:3000",
  pactUrls: [
    path.resolve(__dirname, "../../app/pacts/MedicoApp-Licencias.json"),
    path.resolve(__dirname, "../../app/pacts/PortalPaciente-Licencias.json"),
    path.resolve(__dirname, "../../app/pacts/ValidadorAseguradora-Licencias.json"),
  ],
  stateHandlers: {
    "issued license days>0 is creatable": async () => {
      // Could insert a license if needed, or just do nothing
      return Promise.resolve();
    },
    "patient 11111111-1 has issued license folio L-1001": async () => {
      try {
        await prisma.license.upsert({
          where: { folio: "L-1001" },
          update: {
            patientId: "11111111-1",
            doctorId: "D-123",
            diagnosis: "cough",
            startDate: new Date("2025-09-01"),
            days: 7,
            status: "issued",
          },
          create: {
            folio: "L-1001",
            patientId: "11111111-1",
            doctorId: "D-123",
            diagnosis: "cough",
            startDate: new Date("2025-09-01"),
            days: 7,
            status: "issued",
          },
        });
        return Promise.resolve();
      } catch (err) {
        throw err;
      }
    },
    "no licenses for patient 22222222-2": async () => {
      // Remove any licenses for this patient
      await prisma.license.deleteMany({
        where: { patientId: "22222222-2" },
      });
    },
    "license L-404 does not exist": async () => {
      // Ensure this license does not exist
      await prisma.license.deleteMany({
        where: { folio: "L-404" },
      });
    },
  },
});

verifier
  .verifyProvider()
  .then(() => console.log("✅ Pact Verification Success"))
  .catch((err) => console.error("❌ Pact Verification Failed", err));
