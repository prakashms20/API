const express = require('express');
// category
/**
 * @swagger
 * /category:
 *   get:
 *     summary: Retrieve all categories
 *     description: Get a list of all categories.
 *     responses:
 *       200:
 *         description: Successful response with a list of categories.
 *       500:
 *         description: Internal Server Error.
 *   post:
 *     summary: Create a new category
 *     description: Create a new category with a name and description.
 *     responses:
 *       201:
 *         description: Category created successfully.
 *       500:
 *         description: Internal Server Error.
 *   put:
 *     summary: Update a category by ID
 *     description: Update an existing category by ID.
 *     responses:
 *       200:
 *         description: Category updated successfully.
 *       500:
 *         description: Internal Server Error.
 *
 *   delete:
 *     summary: Delete a category by ID
 *     description: Delete an existing category by ID.
 *     responses:
 *       200:
 *         description: Category deleted successfully.
 *       500:
 *         description: Internal Server Error.
 */
const router = express.Router();

module.exports = (pool, authenticateJWT) => {
  // Create a new category
  router.post('/', authenticateJWT, async (req, res) => {
    const { name, description } = req.body;
    try {
      const client = await pool.connect();
      const result = await client.query(
        'INSERT INTO category (name, description) VALUES ($1, $2) RETURNING id',
        [name, description]
      );
      const newCategoryId = result.rows[0].id;
      client.release();
      res.status(201).json({ id: newCategoryId, name, description });
    } catch (err) {
      console.error('Error creating category', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Read all categories
  router.get('/', authenticateJWT, async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM category');
      const categories = result.rows;
      client.release();
      res.json(categories);
    } catch (err) {
      console.error('Error retrieving categories', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Update a category by ID
  router.put('/:id', authenticateJWT, async (req, res) => {
    const categoryId = req.params.id;
    const { name, description } = req.body;
    try {
      const client = await pool.connect();
      await client.query(
        'UPDATE category SET name = $1, description = $2 WHERE id = $3',
        [name, description, categoryId]
      );
      client.release();
      res.json({ message: 'Category updated successfully' });
    } catch (err) {
      console.error('Error updating category', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Delete a category by ID
  router.delete('/:id', authenticateJWT, async (req, res) => {
    const categoryId = req.params.id;
    try {
      const client = await pool.connect();
      await client.query('DELETE FROM category WHERE id = $1', [categoryId]);
      client.release();
      res.json({ message: 'Category deleted successfully' });
    } catch (err) {
      console.error('Error deleting category', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  return router;
};
