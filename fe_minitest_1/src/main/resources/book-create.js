$(document).ready(function() {
    loadCategories();

    $('#createBookForm').submit(function(e) {
        e.preventDefault();
        createBook();
    });
});

function loadCategories() {
    $.ajax({
        url: 'http://localhost:8080/api/categories',
        method: 'GET',
        success: function(categories) {
            const categorySelect = $('#category');
            categorySelect.empty();
            $.each(categories, function(index, category) {
                categorySelect.append($('<option></option>').attr('value', category.id).text(category.name));
            });
        },
        error: function(xhr, status, error) {
            console.error("Error creating book:", status, error);
            console.log("Response:", xhr.responseText);
            if (xhr.responseJSON && xhr.responseJSON.length > 0) {
                const errors = xhr.responseJSON.map(error => error.defaultMessage).join('<br>');
                showMessage(errors, 'danger');
            } else {
                showMessage('Error creating book: ' + xhr.responseText, 'danger');
            }
        }
    });
}

function createBook() {
    const formData = new FormData($('#createBookForm')[0]);

    for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }

    $.ajax({
        url: 'http://localhost:8080/api/books/create',
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            showMessage('Book created successfully', 'success');
            $('#createBookForm')[0].reset();
        },
        error: function(xhr, status, error) {
            console.error("Error creating book:", status, error);
            console.log("Response:", xhr.responseText);
            let errorMessage = 'Error creating book';
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
    });
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

