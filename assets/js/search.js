(function() {
  'use strict';

  var searchInput = document.getElementById('search-input');
  var searchResults = document.getElementById('search-results');
  var searchIndex = null;
  var pagesData = [];
  var debounceTimer = null;
  var selectedIndex = -1;

  function initSearch() {
    if (!searchInput || !searchResults) return;

    fetch('/index.json')
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        pagesData = data;
        searchIndex = new FlexSearch.Index({
          tokenize: 'forward',
          encode: false
        });

        pagesData.forEach(function(page, idx) {
          searchIndex.add(idx, page.title + ' ' + page.content);
        });
      })
      .catch(function(err) {
        console.error('Failed to load search index:', err);
      });

    searchInput.addEventListener('input', function() {
      clearTimeout(debounceTimer);
      selectedIndex = -1;
      debounceTimer = setTimeout(performSearch, 200);
    });

    searchInput.addEventListener('keydown', handleInputKeydown);

    document.addEventListener('keydown', handleGlobalKeydown);

    document.addEventListener('click', function(e) {
      if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.classList.remove('visible');
        selectedIndex = -1;
      }
    });
  }

  function handleInputKeydown(e) {
    var items = searchResults.querySelectorAll('.search-result-item');
    var count = items.length;

    if (e.key === 'Escape') {
      searchInput.value = '';
      searchInput.blur();
      searchResults.innerHTML = '';
      searchResults.classList.remove('visible');
      selectedIndex = -1;
      e.preventDefault();
      return;
    }

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (count === 0) return;

      if (e.key === 'ArrowDown') {
        selectedIndex = (selectedIndex + 1) % count;
      } else {
        selectedIndex = selectedIndex <= 0 ? count - 1 : selectedIndex - 1;
      }
      updateSelection(items);
      return;
    }

    if (e.key === 'Enter') {
      if (selectedIndex >= 0 && items[selectedIndex]) {
        e.preventDefault();
        items[selectedIndex].click();
      }
    }
  }

  function handleGlobalKeydown(e) {
    var isInputFocused = document.activeElement === searchInput;
    var isTyping = document.activeElement.tagName === 'INPUT' ||
                   document.activeElement.tagName === 'TEXTAREA' ||
                   document.activeElement.isContentEditable;

    if (isTyping) return;

    if (e.key === '/') {
      e.preventDefault();
      searchInput.focus();
      return;
    }

    if (!searchResults.classList.contains('visible')) return;

    var items = searchResults.querySelectorAll('.search-result-item');
    var count = items.length;
    if (count === 0) return;

    if (e.key === 'j' || e.key === 'J') {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % count;
      updateSelection(items);
      return;
    }

    if (e.key === 'k' || e.key === 'K') {
      e.preventDefault();
      selectedIndex = selectedIndex <= 0 ? count - 1 : selectedIndex - 1;
      updateSelection(items);
      return;
    }

    if (e.key === 'Enter') {
      if (selectedIndex >= 0 && items[selectedIndex]) {
        e.preventDefault();
        items[selectedIndex].click();
      }
    }
  }

  function updateSelection(items) {
    items.forEach(function(item, i) {
      if (i === selectedIndex) {
        item.classList.add('selected');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('selected');
      }
    });
  }

  function performSearch() {
    var query = searchInput.value.trim();

    if (!query || !searchIndex) {
      searchResults.innerHTML = '';
      searchResults.classList.remove('visible');
      return;
    }

    var results = searchIndex.search(query, { limit: 10 });

    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
      searchResults.classList.add('visible');
      return;
    }

    var html = results.map(function(idx) {
      var page = pagesData[idx];
      return '<a href="' + page.permalink + '" class="search-result-item">' +
        '<div class="search-result-title">' + escapeHtml(page.title) + '</div>' +
        '<div class="search-result-summary">' + escapeHtml(page.summary) + '</div>' +
        '</a>';
    }).join('');

    searchResults.innerHTML = html;
    searchResults.classList.add('visible');
    selectedIndex = -1;
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
  } else {
    initSearch();
  }
})();
