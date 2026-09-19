/* =========================================================================
   Lingua Bona — сценарии сайта

   Аккордеоны собраны на Bootstrap Collapse (разметка в index.html),
   слайдеры карточек — на нативной горизонтальной прокрутке со scroll-snap,
   поэтому здесь остаются кнопка «Показать еще» в блоке диагностики,
   фильтр категорий (услуги, врачи, цены) и поиск по прайсу.
   ========================================================================= */

/* ------------------- Кнопка «Показать еще» (главная) ------------------- */

(function () {
  'use strict';

  var moreButton = document.querySelector('[data-more-toggle="diagnostics"]');
  var moreTarget = document.getElementById('diagnosisAccordion');

  if (!moreButton || !moreTarget) {
    return;
  }

  var label = moreButton.querySelector('[data-more-label]');
  var collapsedText = label ? label.textContent : '';

  moreButton.addEventListener('click', function () {
    var expanded = moreTarget.classList.toggle('is-expanded');

    moreButton.classList.toggle('is-expanded', expanded);
    moreButton.setAttribute('aria-expanded', String(expanded));

    if (label) {
      label.textContent = expanded ? 'Свернуть' : collapsedText;
    }
  });
}());

/* ------------------- Фильтр карточек (услуги, врачи) -------------------

   Разметка: контейнер с data-filter-group="имя", карточки внутри него с
   data-filter-item="категория", кнопки с data-filter-for="имя" и
   data-filter-value="категория" ("all" — показать всё).
   ---------------------------------------------------------------------- */

(function () {
  'use strict';

  var groups = document.querySelectorAll('[data-filter-group]');

  Array.prototype.forEach.call(groups, function (group) {
    var name = group.getAttribute('data-filter-group');
    var tabs = document.querySelectorAll('[data-filter-for="' + name + '"]');
    var items = group.querySelectorAll('[data-filter-item]');
    var empty = document.querySelector('[data-filter-empty="' + name + '"]');

    if (!tabs.length || !items.length) {
      return;
    }

    Array.prototype.forEach.call(tabs, function (tab) {
      tab.addEventListener('click', function () {
        var value = tab.getAttribute('data-filter-value');
        var shown = 0;

        Array.prototype.forEach.call(tabs, function (button) {
          var active = button === tab;

          button.classList.toggle('is-active', active);
          button.setAttribute('aria-selected', String(active));
        });

        Array.prototype.forEach.call(items, function (card) {
          var match = value === 'all' || card.getAttribute('data-filter-item') === value;

          card.hidden = !match;

          if (match && !card.classList.contains('is-hidden')) {
            shown += 1;
          }
        });

        if (empty) {
          empty.hidden = shown > 0;
        }
      });
    });
  });
}());

/* ---------------------- Поиск по прайсу (цены) ----------------------

   Разметка: поле с data-price-search="имя" ищет по строкам
   data-price-row внутри группы data-filter-group="имя".
   -------------------------------------------------------------------- */

(function () {
  'use strict';

  var inputs = document.querySelectorAll('[data-price-search]');

  Array.prototype.forEach.call(inputs, function (input) {
    var name = input.getAttribute('data-price-search');
    var group = document.querySelector('[data-filter-group="' + name + '"]');
    var empty = document.querySelector('[data-filter-empty="' + name + '"]');

    if (!group) {
      return;
    }

    var cards = group.querySelectorAll('[data-filter-item]');

    input.addEventListener('input', function () {
      var query = input.value.trim().toLowerCase();
      var shown = 0;

      Array.prototype.forEach.call(cards, function (card) {
        var rows = card.querySelectorAll('[data-price-row]');
        var visible = 0;

        Array.prototype.forEach.call(rows, function (row) {
          var match = !query || row.textContent.toLowerCase().indexOf(query) !== -1;

          row.classList.toggle('is-hidden', !match);

          if (match) {
            visible += 1;
          }
        });

        card.classList.toggle('is-hidden', visible === 0);

        if (visible > 0 && !card.hidden) {
          shown += 1;
        }
      });

      if (empty) {
        empty.hidden = shown > 0;
      }
    });
  });
}());

/* ------------- Ширина по макету: округление как в Figma -------------

   Figma округляет ширину текстового слоя вверх до целого пикселя, поэтому
   в макете блок шире отрисованной строки на доли пикселя, а соседние
   элементы сдвинуты. Повторяем это округление после загрузки шрифтов для
   кнопок фильтра и всех элементов с атрибутом data-pixel-round.
   -------------------------------------------------------------------- */

(function () {
  'use strict';

  var nodes = document.querySelectorAll('.tab-btn, .menu-btn, [data-pixel-round]');

  if (!nodes.length || !document.fonts) {
    return;
  }

  function apply() {
    Array.prototype.forEach.call(nodes, function (node) {
      node.style.width = '';
    });

    /* Ниже 1200 действует адаптив, макета на эти ширины нет */
    if (window.innerWidth < 1200) {
      return;
    }

    Array.prototype.forEach.call(nodes, function (node) {
      var width = node.getBoundingClientRect().width;

      if (width > 0) {
        node.style.width = Math.ceil(width) + 'px';
      }
    });
  }

  document.fonts.ready.then(apply);
  window.addEventListener('resize', apply);
}());

/* ------------------- Поиск по вопросам (вопрос-ответ) -------------------

   Разметка: поле с data-faq-search ищет по карточкам .faq-item внутри
   списка data-faq-list, сообщение data-faq-empty показывается,
   когда ничего не найдено.
   ------------------------------------------------------------------- */

(function () {
  'use strict';

  var input = document.querySelector('[data-faq-search]');
  var list = document.querySelector('[data-faq-list]');

  if (!input || !list) {
    return;
  }

  var items = list.querySelectorAll('.faq-item');
  var empty = document.querySelector('[data-faq-empty]');

  input.addEventListener('input', function () {
    var query = input.value.trim().toLowerCase();
    var shown = 0;

    Array.prototype.forEach.call(items, function (item) {
      var match = !query || item.textContent.toLowerCase().indexOf(query) !== -1;

      item.hidden = !match;

      if (match) {
        shown += 1;
      }
    });

    if (empty) {
      empty.hidden = shown > 0;
    }
  });
}());
