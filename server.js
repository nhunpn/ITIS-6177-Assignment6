const express = require('express');
const app = express();
const port = 3000;
const mariadb = require('mariadb');

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

const options = {
    swaggerDefinition: {
        info: {
            title: 'Assignment 6 API',
            version: '1.0.0',
            description: 'Assignment 6 API and Swagger documentation'
        },
        host: 'localhost:3000',
        basePath: '/',
    },
    apis: ['./server.js'],
};

const specs = swaggerJsdoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors());
app.use(express.json());



const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'sample',
  port: 3306,
  connectionLimit: 100,
});

// POST endpoint
/**
 * @swagger
 * /agents:
 *   post:
 *     description: Create a new agent
 *     parameters:
 *       - name: agent
 *         in: body
 *         description: The agent object to be created
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             AGENT_CODE:
 *               type: string
 *               example: 'A001'
 *             AGENT_NAME:
 *               type: string
 *               example: 'John Doe'
 *             WORKING_AREA:
 *               type: string
 *               example: 'New York'
 *             COMMISSION:
 *               type: number
 *               example: 5.5
 *             PHONE_NO:
 *               type: string
 *               example: '1234567890'
 *             COUNTRY:
 *               type: string
 *               example: 'USA'
 *     responses:
 *       201:
 *         description: Agent created successfully
 *       400:
 *         description: Invalid input
 */
app.post('/agents', async (req, res) => {
    const { AGENT_CODE, AGENT_NAME, WORKING_AREA, COMMISSION, PHONE_NO, COUNTRY } = req.body;
    try {
      const conn = await pool.getConnection();
      const result = await conn.query(
        'INSERT INTO agents (AGENT_CODE, AGENT_NAME, WORKING_AREA, COMMISSION, PHONE_NO, COUNTRY) VALUES (?, ?, ?, ?, ?, ?)',
        [AGENT_CODE, AGENT_NAME, WORKING_AREA, COMMISSION, PHONE_NO, COUNTRY]
      );
      conn.end();
      res.status(201).json({ message: 'Agent created successfully', agentCode: AGENT_CODE });
    } catch (err) {
      res.status(500).json({ error: 'Database error', details: err.message });
    }
  });

//PATCH endpoint 
/**
 * @swagger
 * /agents/{code}:
 *   patch:
 *     description: Update an agent's details
 *     parameters:
 *       - name: code
 *         in: path
 *         required: true
 *         description: The agent code to update
 *       - name: agent
 *         in: body
 *         description: The agent object to update
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             AGENT_NAME:
 *               type: string
 *               example: 'Jane Doe'
 *             WORKING_AREA:
 *               type: string
 *               example: 'Los Angeles'
 *     responses:
 *       200:
 *         description: Agent updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Agent not found
 */
app.patch('/agents/:code', async (req, res) => {
    const agentCode = req.params.code;
    const { AGENT_NAME, WORKING_AREA } = req.body;
    try {
      const conn = await pool.getConnection();
      const result = await conn.query(
        'UPDATE agents SET AGENT_NAME = ?, WORKING_AREA = ? WHERE AGENT_CODE = ?',
        [AGENT_NAME, WORKING_AREA, agentCode]
      );
      conn.end();
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Agent not found' });
      }
      res.json({ message: 'Agent updated successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Database error', details: err.message });
    }
});
  
/**
 * @swagger
* /agents/{code}:
*   put:
*     description: Replace an agent's details
*     parameters:
*       - name: code
*         in: path
*         required: true
*         description: The agent code to replace
*       - name: agent
*         in: body
*         description: The new agent object
*         required: true
*         schema:
*           type: object
*           properties:
*             AGENT_NAME:
*               type: string
*               example: 'Alice'
*             WORKING_AREA:
*               type: string
*               example: 'San Francisco'
*             COMMISSION:
*               type: number
*               example: 8.0
*             PHONE_NO:
*               type: string
*               example: '9876543210'
*             COUNTRY:
*               type: string
*               example: 'Canada'
*     responses:
*       200:
*         description: Agent replaced successfully
*       400:
*         description: Invalid input
*       404:
*         description: Agent not found
*/
app.put('/agents/:code', async (req, res) => {
    const agentCode = req.params.code;
    const { AGENT_NAME, WORKING_AREA, COMMISSION, PHONE_NO, COUNTRY } = req.body;
    try {
      const conn = await pool.getConnection();
      const result = await conn.query(
        'UPDATE agents SET AGENT_NAME = ?, WORKING_AREA = ?, COMMISSION = ?, PHONE_NO = ?, COUNTRY = ? WHERE AGENT_CODE = ?',
        [AGENT_NAME, WORKING_AREA, COMMISSION, PHONE_NO, COUNTRY, agentCode]
      );
      conn.end();
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Agent not found' });
      }
      res.json({ message: 'Agent replaced successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Database error', details: err.message });
    }
});
  
/**
* @swagger
* /agents/{code}:
*   delete:
*     description: Delete an agent by AGENT_CODE
*     parameters:
*       - name: code
*         in: path
*         required: true
*         description: The agent code to delete
*     responses:
*       200:
*         description: Agent deleted successfully
*       404:
*         description: Agent not found
*/
app.delete('/agents/:code', async (req, res) => {
    const agentCode = req.params.code;
    try {
      const conn = await pool.getConnection();
      const result = await conn.query('DELETE FROM agents WHERE AGENT_CODE = ?', [agentCode]);
      conn.end();
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Agent not found' });
      }
      res.json({ message: 'Agent deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// Assignment 5

app.get('/agents', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM agents');
    conn.end();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});


app.get('/agents/:code', async (req, res) => {
  const agentCode = req.params.code;
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM agents WHERE AGENT_CODE = ?', [agentCode]);
    conn.end();
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

app.get('/company', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM company');
    conn.end();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

app.get('/company/:id', async (req, res) => {
  const companyID = req.params.id;
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM company WHERE COMPANY_ID = ?', [companyID]);
    conn.end();
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

