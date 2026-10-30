<nav class="main-header navbar navbar-expand navbar-light" id="mainNavbar">
    <ul class="navbar-nav">
        <li class="nav-item">
            <a class="nav-link" data-widget="pushmenu" href="#" role="button">
                <i class="fas fa-bars"></i>
            </a>
        </li>
    </ul>

    <ul class="navbar-nav ml-auto">
        <li class="nav-item">
            <a class="nav-link" href="#">
                <?= esc(session()->get('email') ?? 'Account') ?>
                <i class="far fa-user-circle ml-1"></i>
            </a>
        </li>

        <li class="nav-item">
            <a class="nav-link" href="<?= base_url('/logout') ?>">
                Logout <i class="fa fa-sign-out-alt fa-fw"></i>
            </a>
        </li>
    </ul>
</nav>
