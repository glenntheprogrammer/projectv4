<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project 4 | Register</title>
    <link rel="stylesheet" href="<?= base_url('assets/adminlte/plugins/fontawesome-free/css/all.min.css') ?>">
    <link rel="stylesheet" href="<?= base_url('assets/adminlte/dist/css/adminlte.min.css') ?>">
    <link rel="stylesheet" href="<?= base_url('assets/css/projectv3-theme.css') ?>">
</head>
<body class="auth-page d-flex align-items-center justify-content-center">
    <main class="auth-box">
        <div class="card">
            <div class="card-body p-4">
                <div class="project4-logo-mark" aria-hidden="true">P4</div>
                <h1 class="h4 text-center mb-1">Create an account</h1>
                <p class="text-muted text-center mb-4">Project 4</p>

                <?php if (session()->getFlashdata('error')): ?>
                    <div class="alert alert-danger"><?= esc(session()->getFlashdata('error')) ?></div>
                <?php endif; ?>

                <form action="/register-post" method="POST">
                    <div class="form-group">
                        <label for="registerEmail">Email</label>
                        <input id="registerEmail" type="email" name="email" class="form-control" placeholder="name@example.com" required>
                    </div>
                    <div class="form-group">
                        <label for="registerPassword">Password</label>
                        <input id="registerPassword" type="password" name="password" class="form-control" placeholder="Enter your password" required>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block mt-4">
                        <i class="fas fa-user-plus mr-1"></i> Register
                    </button>
                </form>

                <p class="text-center text-muted mb-0 mt-4">
                    Already have an account? <a href="<?= base_url('/login') ?>">Sign in</a>
                </p>
            </div>
        </div>
    </main>
</body>
</html>
