document.addEventListener('DOMContentLoaded', () => {
    fetchBooks();
    fetchTransactions();

    // Event Listeners
    document.getElementById('addBookForm').addEventListener('submit', handleAddBook);
    document.getElementById('issueBookForm').addEventListener('submit', handleIssueBook);
    document.getElementById('returnBookForm').addEventListener('submit', handleReturnBook);
});

// Toast Notification
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMessage');
    
    toastMsg.textContent = message;
    toast.className = `fixed bottom-5 right-5 transform transition-all duration-300 rounded shadow-lg px-6 py-4 flex items-center z-50 ${isError ? 'bg-red-50 border-l-4 border-red-500' : 'bg-green-50 border-l-4 border-green-500'}`;
    toast.classList.remove('translate-y-20', 'opacity-0');
    
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}

// Fetch and render books
async function fetchBooks() {
    try {
        const res = await fetch('/api/books');
        const books = await res.json();
        
        const tbody = document.getElementById('booksTableBody');
        const issueSelect = document.getElementById('issueBookSelect');
        
        tbody.innerHTML = '';
        issueSelect.innerHTML = '<option value="">Select a book...</option>';
        
        books.forEach(book => {
            // Populate Table
            const tr = document.createElement('tr');
            tr.className = "border-b border-gray-100 hover:bg-gray-50/50 transition duration-150";
            
            const availabilityBadge = book.availableCopies > 0 
                ? `<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">${book.availableCopies} available</span>`
                : `<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Out of stock</span>`;

            tr.innerHTML = `
                <td class="py-4 px-2">
                    <div class="font-bold text-gray-800">${book.title}</div>
                    <div class="text-xs text-gray-500">by ${book.author}</div>
                </td>
                <td class="py-4 px-2 font-medium text-gray-600">${book.totalCopies}</td>
                <td class="py-4 px-2">${availabilityBadge}</td>
                <td class="py-4 px-2 text-right">
                    <button onclick="deleteBook('${book._id}')" class="text-red-500 hover:text-red-700 transition font-medium text-sm">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);

            // Populate Issue Select
            if (book.availableCopies > 0) {
                const option = document.createElement('option');
                option.value = book._id;
                option.textContent = `${book.title} (${book.availableCopies} avail)`;
                issueSelect.appendChild(option);
            }
        });
    } catch (err) {
        showToast('Failed to load books', true);
    }
}

// Fetch active transactions for returns
async function fetchTransactions() {
    try {
        const res = await fetch('/api/transactions');
        const transactions = await res.json();
        
        const returnSelect = document.getElementById('returnTransactionSelect');
        returnSelect.innerHTML = '<option value="">Select transaction...</option>';
        
        transactions.forEach(t => {
            if(!t.bookId) return; // In case book was deleted
            const option = document.createElement('option');
            option.value = t._id;
            const date = new Date(t.issueDate).toLocaleDateString();
            option.textContent = `${t.studentName} - ${t.bookId.title} (${date})`;
            returnSelect.appendChild(option);
        });
    } catch (err) {
        showToast('Failed to load transactions', true);
    }
}

// Add a book
async function handleAddBook(e) {
    e.preventDefault();
    const title = document.getElementById('newBookTitle').value;
    const author = document.getElementById('newBookAuthor').value;
    const totalCopies = document.getElementById('newBookCopies').value;

    try {
        const res = await fetch('/api/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, author, totalCopies })
        });
        
        if (res.ok) {
            showToast('Book added successfully!');
            document.getElementById('addBookForm').reset();
            document.getElementById('addBookModal').classList.add('hidden');
            fetchBooks();
        } else {
            const data = await res.json();
            showToast(data.error || 'Failed to add book', true);
        }
    } catch (err) {
        showToast('Network error', true);
    }
}

// Delete a book
async function deleteBook(id) {
    if (!confirm('Are you sure you want to delete this book?')) return;
    
    try {
        const res = await fetch(`/api/books/${id}`, { method: 'DELETE' });
        if (res.ok) {
            showToast('Book deleted successfully');
            fetchBooks();
            fetchTransactions(); // Refresh transactions in case a deleted book was in the list
        } else {
            showToast('Failed to delete book', true);
        }
    } catch (err) {
        showToast('Network error', true);
    }
}

// Issue a book
async function handleIssueBook(e) {
    e.preventDefault();
    const bookId = document.getElementById('issueBookSelect').value;
    const studentName = document.getElementById('studentName').value;

    try {
        const res = await fetch('/api/issue', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookId, studentName })
        });
        
        if (res.ok) {
            showToast('Book issued successfully!');
            document.getElementById('issueBookForm').reset();
            fetchBooks();
            fetchTransactions();
        } else {
            const data = await res.json();
            showToast(data.error || 'Failed to issue book', true);
        }
    } catch (err) {
        showToast('Network error', true);
    }
}

// Return a book
async function handleReturnBook(e) {
    e.preventDefault();
    const transactionId = document.getElementById('returnTransactionSelect').value;

    try {
        const res = await fetch('/api/return', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transactionId })
        });
        
        if (res.ok) {
            showToast('Book returned successfully!');
            document.getElementById('returnBookForm').reset();
            fetchBooks();
            fetchTransactions();
        } else {
            const data = await res.json();
            showToast(data.error || 'Failed to return book', true);
        }
    } catch (err) {
        showToast('Network error', true);
    }
}
