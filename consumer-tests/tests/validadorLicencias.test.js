const path = require('path');
const { Pact } = require('@pact-foundation/pact');
const axios = require('axios');

const provider = new Pact({
  consumer: 'ValidadorAseguradora',
  provider: 'Licencias',
  port: 1236,
  log: path.resolve(process.cwd(), 'pact-validador.log'),
  dir: path.resolve(process.cwd(), '../pacts'),
});

describe('ValidadorAseguradora -> Licencias Pact', () => {

  beforeAll(async () => await provider.setup());
  afterAll(async () => await provider.finalize());
  afterEach(async () => await provider.verify());

  test('GET /licenses/{folio}/verify returns valid:true', async () => {
    provider.addInteraction({
      state: 'patient 11111111-1 has issued license folio L-1001',
      uponReceiving: 'a request to verify an existing license',
      withRequest: {
        method: 'GET',
        path: '/licenses/L-1001/verify'
      },
      willRespondWith: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: { valid: true }
      }
    });

    const response = await axios.get('http://127.0.0.1:1236/licenses/L-1001/verify');
    expect(response.status).toBe(200);
    expect(response.data.valid).toBe(true);
  });

  test('GET /licenses/NOEXIST/verify returns valid:false', async () => {
    provider.addInteraction({
      state: 'license L-404 does not exist',
      uponReceiving: 'a request to verify a non-existent license',
      withRequest: {
        method: 'GET',
        path: '/licenses/NOEXIST/verify'
      },
      willRespondWith: {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
        body: { valid: false }
      }
    });

    try {
      await axios.get('http://localhost:1236/licenses/NOEXIST/verify');
    } catch (err) {
      expect(err.response.status).toBe(404);
      expect(err.response.data.valid).toBe(false);
    }
  });

});
