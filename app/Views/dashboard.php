<?= $this->extend('theme/template') ?>

<?= $this->section('content') ?>
<div class="content-wrapper">
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <span class="page-pretitle">Overview</span>
            <h1 class="m-0">Dashboard</h1>
          </div>
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="<?= base_url('dashboard') ?>">Home</a></li>
              <li class="breadcrumb-item active">Dashboard</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
<!-- <section class="content">
  <div class="container-fluid">
    <div class="card">
      <div class="card-body p-4">
        <div class="d-flex align-items-center mb-3">
          <span class="bmis-dashboard-mark mr-3" aria-hidden="true">
            <i class="fas fa-school"></i>
          </span>
          <div>
            <span class="page-pretitle">ProjectV4</span>
            <h2 class="h4 mb-0">Welcome to your management portal</h2>
          </div>
        </div>
        <p class="text-muted mb-0">
          Use the menu to manage user accounts and review recent activity.
        </p>
        <div class="mt-4 d-flex flex-wrap">
          <a href="<?= base_url('users') ?>" class="btn btn-primary mr-2 mb-2">
            <i class="fas fa-users mr-1"></i> User accounts
          </a>
          <a href="<?= base_url('log') ?>" class="btn btn-outline-primary mb-2">
            <i class="fas fa-history mr-1"></i> Activity logs
          </a>
        </div>
      </div>
    </div>
  </div>
</section> -->
</div>
<?= $this->endSection() ?>