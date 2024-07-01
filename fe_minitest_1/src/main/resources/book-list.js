let currentPage = 0;
let pageSize = 3;
let totalPages = 0;

$(document).ready(function() {
    loadBooks();

    $('#searchForm').submit(function(e) {
        e.preventDefault();
        currentPage = 0;
        loadBooks();
    });
});

function loadBooks() {
    const search = $('#searchInput').val();
    $.ajax({
        url: `http://localhost:8080/api/books?page=${currentPage}&size=${pageSize}&search=${search}`,
        method: 'GET',
        success: function(response) {
            displayBooks(response.content);
            updatePagination(response);
        },
        error: function() {
            showMessage('Error loading books', 'danger');
        }
    });
}

function displayBooks(books) {
    const tableBody = $('#bookTableBody');
    tableBody.empty();
    $.each(books, function(index, book) {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${book.name}</td>
                <td>${book.author}</td>
                <td>${book.price}</td>
                <td>${book.category.name}</td>
                <td><img width="100" height="100" src="/api/image/${book.image}" alt="book image" class="img-thumbnail"></td>
                <td>
                    <a href="book-update.html?id=${book.id}" class="btn btn-success btn-sm">Update</a>
                    <button class="btn btn-danger btn-sm delete-book" data-id="${book.id}">Delete</button>
                </td>
            </tr>
        `;
        tableBody.append(row);
    });

    $('.delete-book').click(function() {
        deleteBook($(this).data('id'));
    });
}

function updatePagination(pageData) {
    totalPages = pageData.totalPages;
    const pagination = $('#pagination');
    pagination.empty();

    pagination.append(`
        <li class="page-item ${currentPage === 0 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Previous</a>
        </li>
    `);

    for (let i = 0; i < totalPages; i++) {
        pagination.append(`
            <li class="page-item ${currentPage === i ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i})">${i + 1}</a>
            </li>
        `);
    }

    pagination.append(`
        <li class="page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">Next</a>
        </li>
    `);
}

function changePage(newPage) {
    if (newPage >= 0 && newPage < totalPages) {
        currentPage = newPage;
        loadBooks();
    }
}

function deleteBook(id) {
    if (confirm('Are you sure you want to delete this book?')) {
        $.ajax({
            url: 'http://localhost:8080/api/books/' + id,
            method: 'DELETE',
            success: function() {
                loadBooks();
                showMessage('Book deleted successfully', 'success');
            },
            error: function() {
                showMessage('Error deleting book', 'danger');
            }
        });
    }
}

function showMessage(message, type) {
    const messageDiv = $('#message');
    messageDiv.text(message);
    messageDiv.removeClass().addClass('alert alert-' + type);
    messageDiv.show();
    setTimeout(function() {
        messageDiv.hide();
    }, 3000);
}