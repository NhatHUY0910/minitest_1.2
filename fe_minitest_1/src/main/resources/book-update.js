$(document).ready(function() {
    loadCategories();
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');
    if (bookId) {
        loadBook(bookId);
    } else {
        showMessage('Book ID is missing', 'danger');
    }

    $('#updateBookForm').submit(function(e) {
        e.preventDefault();
        updateBook();
    });
});

function loadCategories() {
    $.ajax({
        url: 'http://localhost:8080/api/books/categories',
        method: 'GET',
        success: function(categories) {
            const categorySelect = $('#category');
            categorySelect.empty();
            $.each(categories, function(index, category) {
                categorySelect.append($('<option></option>').attr('value', category.id).text(category.name));
            });
        },
        error: function() {
            showMessage('Error loading categories', 'danger');
        }
    });
}

function loadBook(id) {
    $.ajax({
        url: 'http://localhost:8080/api/books/' + id,
        method: 'GET',
        success: function(book) {
            $('#bookId').val(book.id);
            $('#name').val(book.name);
            $('#author').val(book.author);
            $('#price').val(book.price);
            $('#category').val(book.category.id);
        },
        error: function() {
            showMessage('Error loading book', 'danger');
        }
    });
}

function updateBook() {
    const bookId = $('#bookId').val();
    const formData = new FormData($('#updateBookForm')[0]);

    const data = {
        name: formData.get('name'),
        author: formData.get('author'),
        price: formData.get('price'),
        category: {
            id: parseInt(formData.get('category')),
        }
    };

    const xhr = new XMLHttpRequest();
    xhr.open('PUT', 'http://localhost:8080/api/books/' + bookId);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function() {
        if (xhr.status === 200) {
            showMessage('Book updated successfully', 'success');
            setTimeout(function() {
                window.location.href = 'book-list.html';
            }, 2000);
        } else {
            console.error("Error updating book:", xhr.status, xhr.statusText);
            console.log("Response:", xhr.responseText);
            let errorMessage = 'Error updating book';
            if (xhr.responseText) {
                try {
                    const errorObj = JSON.parse(xhr.responseText);
                    errorMessage = errorObj.message || errorMessage;
                } catch (e) {
                    errorMessage = xhr.responseText;
                }
            }
            showMessage(errorMessage, 'danger');
        }
    };

    xhr.send(JSON.stringify(data));

    const imageFile = formData.get('image');
    if (imageFile && imageFile.size > 0) {
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);

        $.ajax({
            url: 'http://localhost:8080/api/books/' + bookId + '/image',
            method: 'POST',
            data: imageFormData,
            processData: false,
            contentType: false,
            success: function(response) {
                console.log('Image updated successfully');
            },
            error: function(xhr, status, error) {
                console.error("Error updating image:", status, error);
            }
        });
    }
}

function showMessage(message, type) {
    const messageDiv = $('#message');
    messageDiv.html(message);
    messageDiv.removeClass().addClass('alert alert-' + type);
    messageDiv.show();
    setTimeout(function() {
        messageDiv.hide();
    }, 5000);
}