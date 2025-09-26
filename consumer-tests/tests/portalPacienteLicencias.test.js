const path = require('path');
const { Pact, Matchers } = require('@pact-foundation/pact');
const axios = require('axios');

const provider = new Pact({
    consumer: 'PortalPaciente',
    provider: 'Licencias',
    port: 1235,
    log: path.resolve(process.cwd(), 'pact-portal.log'),
    dir: path.resolve(process.cwd(), '../pacts'),
});

describe('PortalPaciente -> Licencias Pact', () => {

    beforeAll(async () => await provider.setup());
    afterAll(async () => await provider.finalize());
    afterEach(async () => await provider.verify());

    test('GET /licenses?patientId=11111111-1 returns >=1 licencia', async () => {
        await provider.addInteraction({
            state: 'patient 11111111-1 has issued license folio L-1001',
            uponReceiving: 'a request for patient licenses with results',
            withRequest: {
                method: 'GET',
                path: '/licenses',
                query: { patientId: '11111111-1' }
            },
            willRespondWith: {
                status: 200,
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                body: Matchers.eachLike({
                    folio: 'L-1001',
                    patientId: '11111111-1',
                    doctorId: 'D-123',
                    diagnosis: 'cough',
                    startDate: '2025-09-01T00:00:00.000Z',
                    days: 7,
                    status: 'issued'
                }, { min: 1 })
            }
        });

        const response = await axios.get('http://localhost:1235/licenses?patientId=11111111-1');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.data)).toBe(true);
        expect(response.data.length).toBeGreaterThanOrEqual(1);
        
    });

    test('GET /licenses?patientId=22222222-2 returns empty list', async () => {
        await provider.addInteraction({
            state: 'no licenses for patient 22222222-2',
            uponReceiving: 'a request for patient licenses with no results',
            withRequest: {
                method: 'GET',
                path: '/licenses',
                query: { patientId: '22222222-2' }
            },
            willRespondWith: {
                status: 200,
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                body: []
            }
        });

        const response = await axios.get('http://127.0.0.1:1235/licenses?patientId=22222222-2');
        expect(response.status).toBe(200);
        expect(response.data).toEqual([]);
    });

});
