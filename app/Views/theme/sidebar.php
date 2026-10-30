<aside class="main-sidebar sidebar-light-light sidebar-light elevation-5" id="mainSidebar">
  <div class="brand-link" id="brandLink">
    <span class="brand-logo">
      <span class="brand-logo-mark" aria-hidden="true">P4</span>
    </span>
    <span class="brand-text">
      <span class="brand-name">ProjectV4</span>
      <span class="brand-caption">Management portal</span>
    </span>
  </div>
  <div class="sidebar-menu">
    <nav aria-label="Main navigation">
      <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
        <li class="nav-header sidebar-section-label">Workspace</li>
        <li class="nav-item">
          <a href="<?= base_url('dashboard') ?>" class="nav-link <?= is_active(1, 'dashboard') ?>">
            <i class="nav-icon fas fa-th-large"></i>
            <p>Dashboard</p>
          </a>
        </li>
        <li class="nav-item">
          <a href="<?= base_url('log') ?>" class="nav-link <?= is_active(1, 'log') ?>">
            <i class="nav-icon fas fa-history"></i>
            <p>Activity logs</p>
          </a>
        </li>
        <li class="nav-item">
          <a href="<?= base_url('users') ?>" class="nav-link <?= is_active(1, 'users') ?>">
            <i class="nav-icon fas fa-user-lock"></i>
            <p>User accounts</p>
          </a>
        </li>
      </ul>
    </nav>
  </div>
  <?php $sidebarEmail = (string) (session()->get('email') ?? 'Account'); ?>
  <div class="sidebar-footer">
    <div class="sidebar-profile">
      <span class="sidebar-profile-avatar"><?= esc(strtoupper(substr($sidebarEmail, 0, 1))) ?></span>
      <span class="sidebar-profile-details">
        <span class="sidebar-profile-label">Signed in as</span>
        <span class="sidebar-profile-email" title="<?= esc($sidebarEmail) ?>"><?= esc($sidebarEmail) ?></span>
      </span>
      <i class="sidebar-profile-icon fas fa-shield-alt" aria-hidden="true"></i>
    </div>
  </div>
</aside>
