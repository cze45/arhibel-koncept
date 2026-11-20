(function () {
  var hdr = document.getElementById('hdr');
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mmenu');

  // zaglavlje postaje tamno posle skrolovanja
  function onScroll() {
    hdr.classList.toggle('scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // meni na telefonu
  function setMenu(open) {
    menu.hidden = !open;
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    hdr.classList.toggle('open', open);
  }
  burger.addEventListener('click', function () { setMenu(menu.hidden); });
  menu.querySelectorAll('[data-close]').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });

  // forma u tri koraka; na kraju otvara e-poštu sa popunjenim upitom
  var form = document.getElementById('upit');
  if (!form) return;
  var step = 1;
  var vrsta = '';
  var bar = document.getElementById('anbar');
  var label = document.getElementById('anlabel');
  var chosen = document.getElementById('anvrsta');

  function show(n) {
    step = n;
    form.querySelectorAll('[data-step]').forEach(function (el) {
      el.hidden = Number(el.getAttribute('data-step')) !== n;
    });
    bar.style.width = (Math.min(n, 3) / 3 * 100) + '%';
    label.textContent = n < 4 ? 'Korak ' + n + ' od 3' : 'Upit je spreman';
    chosen.textContent = vrsta;
  }

  function sendMail() {
    var f = form.elements;
    var lines = [
      'Vrsta radova: ' + vrsta,
      'Mesto gradnje: ' + (f.lokacija.value || '-'),
      '',
      'Opis radova:',
      f.poruka.value || '-',
      '',
      'Ime i firma: ' + (f.ime.value || '-'),
      'Telefon: ' + (f.tel.value || '-'),
      'E-pošta: ' + (f.mejl.value || '-')
    ];
    var url = 'mailto:arhibelarhibel@gmail.com'
      + '?subject=' + encodeURIComponent('Upit sa sajta: ' + vrsta)
      + '&body=' + encodeURIComponent(lines.join('\n'));
    window.location.href = url;
  }

  form.querySelectorAll('[data-pick]').forEach(function (b) {
    b.addEventListener('click', function () { vrsta = b.getAttribute('data-pick'); show(2); });
  });
  form.querySelectorAll('[data-next]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (step === 3) sendMail();
      show(Math.min(step + 1, 4));
    });
  });
  form.querySelectorAll('[data-back]').forEach(function (b) {
    b.addEventListener('click', function () { show(Math.max(step - 1, 1)); });
  });
  form.querySelectorAll('[data-restart]').forEach(function (b) {
    b.addEventListener('click', function () { vrsta = ''; form.reset(); show(1); });
  });
  form.addEventListener('submit', function (e) { e.preventDefault(); });

  // ime izabranog fajla
  var file = form.querySelector('.file input[type="file"]');
  if (file) {
    file.addEventListener('change', function () {
      var span = file.parentNode.querySelector('span');
      span.textContent = file.files.length ? file.files[0].name : 'Nijedan fajl nije izabran';
    });
  }
})();
