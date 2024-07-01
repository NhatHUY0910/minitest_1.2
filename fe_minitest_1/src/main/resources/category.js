$(document).ready(function() {
    loadCategories();

    $('#addCategoryBtn').click(function() {
        $('#addCategoryModal').modal('show');
    });

    $('#saveCategoryBtn').click(function() {
        saveCategory();
    });
});

function loadCategories() {
    $.ajax({
        url: 'http://localhost:8080/api/categories',
        method: 'GET',
        success: function(categories) {
            let tableBody = $('#categoryTableBody');
            tableBody.empty();
            $.each(categories, function(index, category) {
                let row = '<tr>' +
                    '<td>' + (index + 1) + '</td>' +
                    '<td>' + category.name + '</td>' +
                    '<td>' +
                    '<button class="btn btn-danger btn-sm delete-category" data-id="' + category.id + '">Delete</button>' +
                    '</td>' +
                    '</tr>';
                tableBody.append(row);
            });
            $('.delete-category').click(function() {
                deleteCategory($(this).data('id'));
            });
        },
        error: function() {
            showMessage('Error loading categories', 'danger');
        }
    });
}

function saveCategory() {
    let categoryName = $('#categoryName').val();
    $.ajax({
        url: 'http://localhost:8080/api/categories',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ name: categoryName }),
        success: function() {
            $('#addCategoryModal').modal('hide');
            $('#categoryName').val('');
            loadCategories();
            showMessage('Category added successfully', 'success');
        },
        error: function() {
            showMessage('Error adding category', 'danger');
        }
    });
}

function deleteCategory(id) {
    if (confirm('Are you sure you want to delete this category?')) {
        $.ajax({
            url: 'http://localhost:8080/api/categories' + id,
            method: 'DELETE',
            success: function() {
                loadCategories();
                showMessage('Category deleted successfully', 'success');
            },
            error: function() {
                showMessage('Error deleting category', 'danger');
            }
        });
    }
}

function showMessage(message, type) {
    let messageDiv = $('#message');
    messageDiv.text(message);
    messageDiv.removeClass().addClass('alert alert-' + type);
    messageDiv.show();
    setTimeout(function() {
        messageDiv.hide();
    }, 3000);
}