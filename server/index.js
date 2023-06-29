const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json()); //req.body

//create a book

app.post("/books", async (req, res) => {
    try {
      const { title, publication_year, num_pages, price } = req.body;
      const newBook = await pool.query(
        "INSERT INTO book (title, publication_year, num_pages, price) VALUES($1, $2, $3, $4) RETURNING *",
        [title, publication_year, num_pages, price]
      );
  
      res.json(newBook.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  });

//get all books

app.get("/books", async (req, res) => {
    try {
      const allBooks = await pool.query("SELECT * FROM book");
      res.json(allBooks.rows);
    } catch (err) {
      console.error(err.message);
    }
  });
  
//get a book

app.get("/books/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const book = await pool.query("SELECT * FROM book WHERE book_id = $1", [
        id
      ]);
  
      res.json(book.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  });

//update a book

app.put("/books/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { title, publication_year, num_pages, price } = req.body;
      const updateBook = await pool.query(
        "UPDATE book SET title = $1, publication_year = $2, num_pages = $3, price = $4 WHERE book_id = $5",
        [title, publication_year, num_pages, price, id]
      );
  
      res.json("Book was updated!");
    } catch (err) {
      console.error(err.message);
    }
  });

//delete a book, with TCL

app.delete("/books/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await pool.query('BEGIN');    
    await pool.query("DELETE FROM book WHERE book_id = $1", [id]);

    await pool.query('COMMIT');   
    res.status(200).send(`Book was deleted`);
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error(error);
    res.status(500).send('An error occurred during book deletion.');
  }
}
);

// app.delete("/books/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deleteBook = await pool.query("DELETE FROM book WHERE book_id = $1", [
//       id
//     ]);
//     res.json("Book was deleted!");
//   } catch (err) {
//     console.log(err.message);
//   }
// });

app.listen(8080, () => {
    console.log("server has started on port 8080");
  });

app.post('/execute_queries', async(req, res) => {
  try{
      const { queries } = req.body;
      const results = await pool.query(queries);
      res.status(200).json({message: 'Queries executed.', results: results.rows});
  } catch (error) {
      console.error('Error executing queries:', error);
      res.status(500).json({ error: 'An error occurred while executing the queries.'});
    }
});
