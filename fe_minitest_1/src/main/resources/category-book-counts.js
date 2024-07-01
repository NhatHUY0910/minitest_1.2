$(document).ready(function() {
    loadCategoryBookCounts();
});

function loadCategoryBookCounts() {
    $.ajax({
        url: 'http://localhost:8080/api/categories/book-counts',
        method: 'GET',
        success: function(categoryBookCounts) {
            let tableBody = $('#categoryBookCountsTableBody');
            tableBody.empty();
            $.each(categoryBookCounts, function(index, count) {
                let row = '<tr>' +
                    '<td>' + (index + 1) + '</td>' +
                    '<td>' + count.category + '</td>' +
                    '<td>' + count.bookNumber + '</td>' +
                    '</tr>';
                tableBody.append(row);
            });
        },
        error: function() {
            alert('Error loading category book counts');
        }
    });
}