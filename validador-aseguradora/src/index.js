const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

const LICENCIAS_URL = process.env.LICENCIAS_URL || 'http://licencias:3000';

// GET /insurer/licenses/:folio/verify
app.get('/insurer/licenses/:folio/verify', async (req, res) => {
  const { folio } = req.params;

  try {
    const response = await axios.get(`${LICENCIAS_URL}/licenses/${folio}/verify`);
    res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status === 404) {
      res.status(404).json({ valid: false });
    } else {
      res.status(500).json({ error: 'ERROR_VERIFYING_LICENSE' });
    }
  }
});

// GET /insurer/patients/:patientId/licenses
app.get('/insurer/patients/:patientId/licenses', async (req, res) => {
  const { patientId } = req.params;

  try {
    const response = await axios.get(`${LICENCIAS_URL}/licenses`, {
      params: { patientId }
    });
    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'ERROR_FETCHING_LICENSES' });
  }
});

app.listen(PORT, () => console.log(`ValidadorAseguradora running on port ${PORT}`));
