const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

// URL del proveedor Licencias desde variable de entorno
const LICENCIAS_URL = process.env.LICENCIAS_URL || 'http://licencias:3000';

// GET /patient/:patientId/licenses
app.get('/patient/:patientId/licenses', async (req, res) => {
  const { patientId } = req.params;

  try {
    const response = await axios.get(`${LICENCIAS_URL}/licenses`, {
      params: { patientId }
    });

    res.status(200).json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(err.response?.status || 500).json({ error: 'ERROR_FETCHING_LICENSES' });
  }
});

app.listen(PORT, () => console.log(`PortalPaciente running on port ${PORT}`));
