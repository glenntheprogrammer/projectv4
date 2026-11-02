function showToast(type, message) {
    if (type === 'success') {
        toastr.success(message, 'Success');
    } else {
        toastr.error(message, 'Error');
    }
}

function refreshUsersTable() {
    const $table = $('#example1');
    if (!$table.length) {
        return;
    }

    if ($.fn.DataTable.isDataTable($table[0])) {
        $table.DataTable().ajax.reload(null, false);
    } else {
        initializeUsersPage();
    }
}

let userIdToDelete = null;

$(document).on('submit', '#addUserForm', function (e) {
    if (!window.location.pathname.includes('/users')) {
        return;
    }

    e.preventDefault();
    $.ajax({
        url: baseUrl + 'users/save',
        method: 'POST',
        data: $(this).serialize(),
        dataType: 'json',
        success: function (response) {
            if (response.status === 'success') {
                $('#AddNewModal').modal('hide');
                $('#addUserForm')[0].reset();
                showToast('success', 'User added successfully!');
                refreshUsersTable();
            } else {
                showToast('error', response.message || 'Failed to add user.');
            }
        },
        error: function () {
            showToast('error', 'An error occurred.');
        }
    });
});

$(document).on('click', '.edit-btn', function () {
   if (!window.location.pathname.includes('/users')) {
       return;
   }

   const userId = $(this).data('id'); 
   $.ajax({
    url: baseUrl + 'users/edit/' + userId,
    method: 'GET',
    dataType: 'json',
    success: function (response) {
        if (response.data) {
            $('#editUserModal #name').val(response.data.name);
            $('#editUserModal #userId').val(response.data.id);
            $('#editUserModal #email').val(response.data.email);
            $('#editUserModal #password').val('');
            $('#editUserModal #role').val(response.data.role);
            $('#editUserModal #status').val(response.data.status);
            $('#editUserModal #phone').val(response.data.phone);
            $('#editUserModal').modal('show');
        } else {
            alert('Error fetching user data');
        }
    },
    error: function () {
        alert('Error fetching user data');
    }
});
});


$(document).on('submit', '#editUserForm', function (e) {
    if (!window.location.pathname.includes('/users')) {
        return;
    }

        e.preventDefault(); 

        $.ajax({
            url: baseUrl + 'users/update',
            method: 'POST',
            data: $(this).serialize(),
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    $('#editUserModal').modal('hide');
                    showToast('success', 'User Updated successfully!');
                    refreshUsersTable();
                } else {
                    alert('Error updating: ' + (response.message || 'Unknown error'));
                }
            },
            error: function (xhr) {
                alert('Error updating');
                console.error(xhr.responseText);
            }
        });
});

$(document).on('click', '.deleteUserBtn', function () {
    if (!window.location.pathname.includes('/users')) {
        return;
    }

    userIdToDelete = $(this).data('id');
    $('#deleteUserModal').modal('show');
});

$(document).on('hidden.bs.modal', '#deleteUserModal', function () {
    userIdToDelete = null;
});

$(document).on('click', '#confirmDeleteUser', function () {
    if (!userIdToDelete) {
        return;
    }

    const $confirmButton = $(this);
    const csrfName = $('meta[name="csrf-name"]').attr('content');
    const csrfToken = $('meta[name="csrf-token"]').attr('content');

    $confirmButton.prop('disabled', true);
    $.ajax({
        url: baseUrl + 'users/delete/' + userIdToDelete,
        method: 'POST',
        data: {
            _method: 'DELETE',
            [csrfName]: csrfToken
        },
        success: function (response) {
            if (response.success) {
                $('#deleteUserModal').modal('hide');
                showToast('success', 'Users deleted successfully.');
                refreshUsersTable();
            } else {
                showToast('error', response.message || 'Failed to delete.');
            }
        },
        error: function () {
            showToast('error', 'Something went wrong while deleting.');
        },
        complete: function () {
            $confirmButton.prop('disabled', false);
        }
    });
});

function initializeUsersPage() {
    if (!window.location.pathname.includes('/users')) {
        return;
    }

    const $table = $('#example1');
    if (!$table.length || $.fn.DataTable.isDataTable($table[0])) {
        return;
    }

    const csrfName = 'csrf_test_name'; 
    const csrfToken = $('input[name="' + csrfName + '"]').val();

    $table.DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: baseUrl + 'users/fetchRecords',
            type: 'POST',
            headers: {
                'X-CSRF-TOKEN': csrfToken
            }
        },
        columns: [
        { data: 'row_number' },
        { data: 'id', visible: false },
        { data: 'name' },
        { data: 'email' },
        { data: 'role' },
        { data: 'status' },
        { data: 'phone' },
        { data: 'created_at' },
        {
            data: null,
            orderable: false,
            searchable: false,
            render: function (data, type, row) {
                return `
                <button class="btn btn-sm btn-warning edit-btn" data-id="${row.id}">
                <i class="far fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger deleteUserBtn" data-id="${row.id}">
                <i class="fas fa-trash-alt"></i>
                </button>
                `;
            }
        }
        ],
        responsive: true,
        autoWidth: false
    });
}

$(document).ready(initializeUsersPage);
document.addEventListener('project4:page-loaded', initializeUsersPage);