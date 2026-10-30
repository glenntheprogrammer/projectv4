<?= $this->extend('theme/template') ?>

<?= $this->section('content') ?>
<div class="content-wrapper">
  <div class="content-header">
    <div class="container-fluid">
      <div class="row align-items-end">
        <div class="col">
          <span class="page-pretitle">Workspace</span>
          <h1 class="m-0">Activity logs</h1>
          <p class="log-page-description mb-0">Review account activity and sign-in events.</p>
        </div>
        <div class="col-auto">
          <ol class="breadcrumb mb-1">
            <li class="breadcrumb-item"><a href="<?= base_url('dashboard') ?>">Home</a></li>
            <li class="breadcrumb-item active">Activity logs</li>
          </ol>
        </div>
      </div>
    </div>
  </div>

  <section class="content">
    <div class="container-fluid">
      <?php
        $activityLogs = $logs ?? [];
        $activityCount = is_countable($activityLogs) ? count($activityLogs) : 0;
        $activeDate = $selectedDate ?? date('Y-m-d');
      ?>

      <div class="card log-filter-card">
        <div class="card-body">
          <form id="dateFilterForm" method="get" class="log-filter-form">
            <div class="log-filter-copy">
              <span class="log-filter-icon"><i class="far fa-calendar-alt" aria-hidden="true"></i></span>
              <span>
                <label for="filterDate" class="log-filter-title">Filter by date</label>
                <span class="log-filter-hint">Choose a day to view its activity.</span>
              </span>
            </div>
            <div class="log-filter-controls">
              <input
                type="date"
                id="filterDate"
                name="date"
                class="form-control"
                value="<?= esc($activeDate) ?>"
                aria-label="Filter activity logs by date">
              <button type="submit" class="btn btn-primary">
                <i class="fas fa-search mr-1" aria-hidden="true"></i> View activity
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="log-results-heading">
        <div>
          <span class="page-pretitle">Daily overview</span>
          <h2 class="log-results-title">
            <?= esc(date('F j, Y', strtotime($activeDate) ?: time())) ?>
          </h2>
        </div>
        <span class="log-count-badge">
          <i class="fas fa-list-ul" aria-hidden="true"></i>
          <?= esc((string) $activityCount) ?> <?= $activityCount === 1 ? 'event' : 'events' ?>
        </span>
      </div>

      <div class="card log-activity-card">
        <?php if ($activityCount > 0): ?>
          <div class="log-activity-list">
            <?php foreach ($activityLogs as $log): ?>
              <?php
                $rawTime = (string) ($log['TIMELOG'] ?? '');
                $parsedTime = strtotime($rawTime);
                $displayTime = $parsedTime !== false ? date('g:i A', $parsedTime) : $rawTime;
              ?>
              <article class="log-activity-entry">
                <div class="log-entry-time">
                  <span class="log-entry-dot" aria-hidden="true"></span>
                  <time><?= esc($displayTime) ?></time>
                </div>
                <div class="log-entry-content">
                  <div class="log-entry-heading">
                    <span class="log-entry-avatar" aria-hidden="true">
                      <i class="fas fa-user" aria-hidden="true"></i>
                    </span>
                    <div class="log-entry-actor">
                      <h3><?= esc($log['USER_NAME'] ?? 'Unknown user') ?></h3>
                      <span>User ID <?= esc((string) ($log['USERID'] ?? '—')) ?></span>
                    </div>
                    <?php if (!empty($log['identifier'])): ?>
                      <span class="log-entry-tag"><?= esc($log['identifier']) ?></span>
                    <?php endif; ?>
                  </div>

                  <p class="log-entry-action"><?= esc($log['ACTION'] ?? '—') ?></p>

                  <div class="log-entry-meta">
                    <span title="IP address">
                      <i class="fas fa-globe" aria-hidden="true"></i>
                      <?= esc($log['user_ip_address'] ?? '—') ?>
                    </span>
                    <span class="log-entry-device" title="<?= esc($log['device_used'] ?? '—') ?>">
                      <i class="fas fa-desktop" aria-hidden="true"></i>
                      <?= esc($log['device_used'] ?? '—') ?>
                    </span>
                  </div>
                </div>
              </article>
            <?php endforeach; ?>
          </div>
        <?php else: ?>
          <div class="log-empty-state">
            <span class="log-empty-icon"><i class="far fa-calendar-times" aria-hidden="true"></i></span>
            <h3>No activity for this date</h3>
            <p>There are no recorded events for <?= esc(date('F j, Y', strtotime($activeDate) ?: time())) ?>.</p>
          </div>
        <?php endif; ?>
      </div>
    </div>
  </section>
</div>
<div class="toasts-top-right fixed" style="position: fixed; top: 1rem; right: 1rem; z-index: 9999;"></div>
<?= $this->endSection() ?>

<?= $this->section('scripts') ?>
<script>
  document.getElementById('filterDate').addEventListener('change', function () {
    document.getElementById('dateFilterForm').requestSubmit();
  });
</script>
<?= $this->endSection() ?>
