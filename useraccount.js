const express = require('express');

/**
 * @swagger
 * /useraccount:
 *   get:
 *     summary: Retrieve all categories
 *     description: Get a list of all categories.
 *     responses:
 *       200:
 *         description: Successful response with a list of categories.
 *       500:
 *         description: Internal Server Error.
 */
const router = express.Router();

module.exports = (pool,authenticateJWT) => {



    router.post('/',authenticateJWT, async (req, res) => {
        const { firstname, lastname, email, phone } = req.body;
        try {
          const client = await pool.connect();
          const result = await client.query(
            'INSERT INTO useraccount (firstname, lastname, email, phone) VALUES ($1, $2, $3, $4) RETURNING id',
            [firstname, lastname, email, phone]
          );
          const newUserId = result.rows[0].id;
          client.release();
          res.status(201).json({ id: newUserId, firstname, lastname, email, phone });
        } catch (err) {
          console.error('Error creating user account', err);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });

      router.get('/',authenticateJWT, async (req, res) => {
        try {
          const client = await pool.connect();
          const result = await client.query('SELECT * FROM useraccount');
          const useraccounts = result.rows;
          client.release();
          res.json(useraccounts);
        } catch (err) {
          console.error('Error retrieving user accounts', err);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });



  return router;
};




  
  