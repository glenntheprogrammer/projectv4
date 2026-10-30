(function () {
  const content = document.getElementById('app-content');
  const status = document.getElementById('navigationStatus');
  const loadedScripts = new Map();
  let activeRequest;

  if (!content || !status) {
    return;
  }

  document.querySelectorAll('#pageScripts script[src]').forEach(function (script) {
    loadedScripts.set(new URL(script.src, window.location.href).href, Promise.resolve());
  });

  function setLoading(isLoading) {
    content.setAttribute('aria-busy', isLoading ? 'true' : 'false');
    document.body.classList.toggle('is-navigating', isLoading);
  }

  function showError(message, url) {
    status.replaceChildren();
    status.classList.add('navigation-status-visible');

    const text = document.createElement('span');
    text.textContent = message;

    const retry = document.createElement('button');
    retry.type = 'button';
    retry.className = 'navigation-status-retry';
    retry.textContent = 'Retry';
    retry.addEventListener('click', function () {
      status.classList.remove('navigation-status-visible');
      navigate(url, { replace: true });
    });

    status.append(text, retry);
  }

  function runInlineScript(source) {
    const script = document.createElement('script');
    script.textContent = source.textContent;
    document.body.appendChild(script);
    script.remove();
  }

  function loadExternalScript(source) {
    const url = new URL(source.src, window.location.href).href;
    if (loadedScripts.has(url)) {
      return loadedScripts.get(url);
    }

    const scriptPromise = new Promise(function (resolve, reject) {
      const script = document.createElement('script');
      script.src = url;
      script.onload = resolve;
      script.onerror = function () {
        loadedScripts.delete(url);
        reject(new Error('Could not load page script: ' + url));
      };
      document.body.appendChild(script);
    });

    loadedScripts.set(url, scriptPromise);
    return scriptPromise;
  }

  async function loadPageScripts(page) {
    const pageScripts = page.querySelectorAll('#pageScripts script');
    for (const script of pageScripts) {
      if (script.src) {
        await loadExternalScript(script);
      } else {
        runInlineScript(script);
      }
    }
  }

  function updateActiveLinks(url) {
    const currentPath = url.pathname.replace(/\/+$/, '') || '/';
    document.querySelectorAll('.main-sidebar .nav-link[href]').forEach(function (link) {
      const linkUrl = new URL(link.href, window.location.href);
      const linkPath = linkUrl.pathname.replace(/\/+$/, '') || '/';
      link.classList.toggle('active', linkPath === currentPath);
    });
  }

  function updateCsrf(page) {
    ['csrf-name', 'csrf-token'].forEach(function (name) {
      const current = document.querySelector('meta[name="' + name + '"]');
      const next = page.querySelector('meta[name="' + name + '"]');
      if (current && next) {
        current.content = next.content;
      }
    });
  }

  async function navigate(href, options) {
    const settings = options || {};
    const url = new URL(href, window.location.href);

    if (url.origin !== window.location.origin) {
      window.location.assign(url.href);
      return;
    }

    if (!settings.popstate && !settings.replace && url.href === window.location.href) {
      return;
    }

    if (activeRequest) {
      activeRequest.abort();
    }

    const request = new AbortController();
    activeRequest = request;
    setLoading(true);
    status.classList.remove('navigation-status-visible');

    try {
      const response = await fetch(url.href, {
        method: 'GET',
        headers: {
          'Accept': 'text/html',
          'X-Requested-With': 'XMLHttpRequest'
        },
        cache: 'no-store',
        signal: request.signal
      });

      if (!response.ok) {
        throw new Error('Navigation failed with status ' + response.status);
      }

      const html = await response.text();
      const page = new DOMParser().parseFromString(html, 'text/html');
      const nextContent = page.getElementById('app-content');
      if (activeRequest !== request) {
        return;
      }

      if (!nextContent) {
        window.location.assign(response.url || url.href);
        return;
      }

      const nextContentFragment = document.createDocumentFragment();
      Array.from(nextContent.childNodes).forEach(function (node) {
        nextContentFragment.appendChild(document.importNode(node, true));
      });

      if (!settings.popstate) {
        const currentState = Object.assign({}, window.history.state, { scrollY: window.scrollY });
        window.history.replaceState(currentState, '', window.location.href);
        const nextState = { scrollY: 0 };
        if (settings.replace) {
          window.history.replaceState(nextState, '', url.href);
        } else {
          window.history.pushState(nextState, '', url.href);
        }
      }

      document.dispatchEvent(new CustomEvent('project4:before-page-change'));
      content.replaceChildren(nextContentFragment);
      document.title = page.title || document.title;
      updateCsrf(page);
      updateActiveLinks(url);

      await loadPageScripts(page);
      if (activeRequest !== request) {
        return;
      }

      document.dispatchEvent(new CustomEvent('project4:page-loaded', { detail: { url: url.href } }));

      if (settings.popstate) {
        window.scrollTo(0, window.history.state && window.history.state.scrollY || 0);
      } else {
        window.scrollTo(0, 0);
      }

      status.replaceChildren();
    } catch (error) {
      if (error.name !== 'AbortError') {
        showError('Could not load this page. Check your connection and try again.', url.href);
        console.error(error);
      }
    } finally {
      if (activeRequest === request) {
        activeRequest = null;
        setLoading(false);
      }
    }
  }

  document.addEventListener('click', function (event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    const link = event.target.closest('a[href]');
    if (!link || link.target || link.hasAttribute('download') || link.dataset.noSpa !== undefined) {
      return;
    }

    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin || url.pathname === window.location.pathname && url.search === window.location.search && url.hash) {
      return;
    }

    if (url.pathname.endsWith('/logout') || url.pathname.endsWith('/login')) {
      return;
    }

    event.preventDefault();
    navigate(url.href);
  });

  document.addEventListener('submit', function (event) {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || form.method.toLowerCase() !== 'get') {
      return;
    }

    event.preventDefault();
    const url = new URL(form.action || window.location.href, window.location.href);
    const formData = new FormData(form);
    url.search = new URLSearchParams(formData).toString();
    navigate(url.href);
  });

  document.addEventListener('project4:before-page-change', function () {
    if (window.jQuery && jQuery.fn.DataTable && jQuery.fn.DataTable.isDataTable('#example1')) {
      jQuery('#example1').DataTable().destroy();
    }
  });

  window.addEventListener('popstate', function () {
    navigate(window.location.href, { popstate: true });
  });

  window.addEventListener('pagehide', function () {
    const currentState = Object.assign({}, window.history.state, { scrollY: window.scrollY });
    window.history.replaceState(currentState, '', window.location.href);
  });

  window.Project4Navigation = {
    navigate: navigate,
    refresh: function () {
      return navigate(window.location.href, { replace: true });
    }
  };

  updateActiveLinks(new URL(window.location.href));
})();
