const express = require('express');
/**
 * @swagger
 * /product:
 *   get:
 *     summary: Retrieve all products
 *     description: Get a list of all products.
 *     responses:
 *       200:
 *         description: Successful response with a list of products.
 *       500:
 *         description: Internal Server Error.
 *   post:
 *     summary: Create a new product
 *     description: Create a new product with a name and products.
 *     responses:
 *       201:
 *         description: product created successfully.
 *       500:
 *         description: Internal Server Error.
 *   put:
 *     summary: Update a product by ID
 *     description: Update an existing product by ID.
 *     responses:
 *       200:
 *         description: product updated successfully.
 *       500:
 *         description: Internal Server Error.
 *
 *   delete:
 *     summary: Delete a product by ID
 *     description: Delete an existing product by ID.
 *     responses:
 *       200:
 *         description: product deleted successfully.
 *       500:
 *         description: Internal Server Error.
 */
const router = express.Router();

module.exports = (pool,authenticateJWT) => {



router.post('/',authenticateJWT, async (req, res) => {
    const { Category_id, price, model } = req.body;
    try {
      const client = await pool.connect();
      const result = await client.query(
        'INSERT INTO product (Category_id, price, model) VALUES ($1, $2, $3) RETURNING id',
        [Category_id, price, model]
      );
      const newProductId = result.rows[0].id;
      client.release();
      res.status(201).json({ id: newProductId, Category_id, price, model });
    } catch (err) {
      console.error('Error creating product', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  router.get('/',authenticateJWT, async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM product');
      const product = result.rows;
      client.release();
      res.json(product);
    } catch (err) {
      console.error('Error retrieving product', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  router.put('/:id', authenticateJWT,async (req, res) => {
    const productId = req.params.id;
    const { Category_id, price, model } = req.body;
    try {
      const client = await pool.connect();
      await client.query(
        'UPDATE product SET Category_id = $1, price = $2, model = $3 WHERE id = $4',
        [Category_id, price, model, productId]
      );
      client.release();
      res.json({ message: 'Product updated successfully' });
    } catch (err) {
      console.error('Error updating product', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  router.delete('/:id',authenticateJWT, async (req, res) => {
    const productId = req.params.id;
    try {
      const client = await pool.connect();
      await client.query('DELETE FROM product WHERE id = $1', [productId]);
      client.release();
      res.json({ message: 'Product deleted successfully' });
    } catch (err) {
      console.error('Error deleting product', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  return router;
};



  
  