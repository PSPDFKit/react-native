window.jazzy = { docset: false };
if (typeof window.dash != 'undefined') {
  document.documentElement.className += ' dash';
  window.jazzy.docset = true;
}
if (navigator.userAgent.match(/xcode/i)) {
  document.documentElement.className += ' xcode';
  window.jazzy.docset = true;
}

if (window.jazzy.docset) {
  // Dash customization here
  $(document).ready(function () {
    $('nav').remove();
  });
} else {
  // On doc load, toggle the URL hash discussion if present
  $(document).ready(function () {
    var linkToHash = $('a[href="' + window.location.hash + '"]');
    linkToHash.trigger('click');
  });

  // When navigating away, store sidebar scroll position,
  // and restore it on next load
  if (window.localStorage) {
    window.onbeforeunload = function (event) {
      localStorage.setItem('sidebar.scroll', $('nav.sidebar').scrollTop());
    };
    $(document).ready(function () {
      var s = localStorage.getItem('sidebar.scroll');
      if (s) {
        $('nav.sidebar').scrollTop(parseInt(s));
      }
    });
  }

  // On token click, toggle its discussion
  $('.token, .hidden-token').click(function (event) {
    if (window.jazzy.docset) {
      return;
    }
    var link = $(this);
    var animationDuration = 300;
    $content = link.parent().parent().next();
    $content.slideToggle(animationDuration);

    // Keeps the document from jumping to the hash.
    var href = $(this).attr('href');
    if (history.pushState) {
      history.pushState({}, '', href);
    } else {
      location.hash = href;
    }
    event.preventDefault();
  });

  // Highlight active sidebar link
  $(document).on('ready', function (e) {
    var path = window.location.pathname;
    $('.sidebar')
      .find('a[href$="' + path + '"]')
      .addClass('active');
  });

  // Jump to page from select menu (mobile)
  $(document).on('change', '.nav-groups-select select', function (e) {
    var value = e.target.value;
    if (value) {
      window.location = value;
    }
  });

  // Hide empty categories
  $(document).on('ready', function (e) {
    $('.sidebar .nav-group-tasks').each(function (idx, item) {
      var $item = $(item);
      if ($item.children('.nav-group-task').length === 0) {
        $item.parents('.nav-group-name').remove();
      }
    });
  });

  // Workaround for https://github.com/PSPDFKit/PSPDFKit/issues/5393
  if (
    navigator.userAgent.indexOf('Safari') != -1 &&
    navigator.userAgent.indexOf('Chrome') == -1
  ) {
    window.onpageshow = function (event) {
      if (event.persisted) {
        $('.main-content, .sidebar').css({ overflow: 'auto' });
        setTimeout(function () {
          $('.main-content, .sidebar').css({ overflow: 'scroll' });
        }, 200);
      }
    };
  }

  // Activate the current platform in the platform switcher
  $(document).on('ready', function (e) {
    var platform = $('meta[name=pspdf-platform]').attr('content');
    $('.navbar .btn[href*="' + platform + '"]').addClass('active');
  });
} // if !dash
