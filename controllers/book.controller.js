const Book = require('../models/Book');

exports.getBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addBook = async (req, res) => {
    try {
        const { title, author, totalCopies } = req.body;
        const newBook = new Book({
            title,
            author,
            totalCopies,
            availableCopies: totalCopies
        });
        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.json({ message: 'Book deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
