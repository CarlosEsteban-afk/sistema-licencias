const path = require("path");
const { Pact, Matchers } = require("@pact-foundation/pact");
const axios = require("axios");

const provider = new Pact({
  consumer: "MedicoApp",
  provider: "Licencias",
  port: 1234,
  log: path.resolve(process.cwd(), "pact-logs.log"),
  dir: path.resolve(process.cwd(), "../pacts"),
  logLevel: "INFO",
});

describe("MedicoApp -> Licencias Pact", () => {
  beforeAll(async () => await provider.setup());


  afterEach(async () => await provider.verify());

  afterAll(async () => await provider.finalize());

  test("POST /licenses days>0 returns 201 with folio", async () => {
    await provider.addInteraction({
      state: "issued license days>0 is creatable",
      uponReceiving: "a request to create a valid license",
      withRequest: {
        method: "POST",
        path: "/licenses",
        headers: { "Content-Type": "application/json" },
        body: {
          patientId: "11111111-1",
          doctorId: "D-123",
          diagnosis: "cough",
          startDate: "2025-09-20",
          days: 7,
        },
      },
      willRespondWith: {
        status: 201,
        headers: { "Content-Type": "application/json" },
        body: {
          folio: Matchers.like("L-1001"),
          patientId: "11111111-1",
          doctorId: "D-123",
          diagnosis: "cough",
          startDate: "2025-09-20T00:00:00.000Z",
          days: 7,
          status: "issued",
        },
      },
    });

    const response = await axios.post("http://localhost:1234/licenses", {
      patientId: "11111111-1",
      doctorId: "D-123",
      diagnosis: "cough",
      startDate: "2025-09-20",
      days: 7,
    });

    expect(response.status).toBe(201);
    expect(response.data.folio).toBeDefined();
  });

  test("POST /licenses days=0 returns 400 INVALID_DAYS", async () => {
    await provider.addInteraction({
      state: "ready to receive invalid license",
      uponReceiving: "a request to create an invalid license",
      withRequest: {
        method: "POST",
        path: "/licenses",
        headers: { "Content-Type": "application/json" },
        body: {
          patientId: "11111111-1",
          doctorId: "D-123",
          diagnosis: "cough",
          startDate: "2025-09-20",
          days: 0,
        },
      },
      willRespondWith: {
        status: 400,
        headers: { "Content-Type": "application/json" },
        body: { error: "INVALID_DAYS" },
      },
    });

    try {
      await axios.post(
        "http://127.0.0.1:1234/licenses",
        {
          patientId: "11111111-1",
          doctorId: "D-123",
          diagnosis: "cough",
          startDate: "2025-09-20",
          days: 0,
        },
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (err) {
      expect(err.response.status).toBe(400);
      expect(err.response.data.error).toBe("INVALID_DAYS");
    }
  });
});
