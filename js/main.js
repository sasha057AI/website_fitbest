/* ===== FitBest — данные и логика лендинга ===== */

/* --------------------------------------------------------------------------
 * ТОВАРЫ — единственный источник данных каталога.
 * Чтобы изменить каталог: отредактируйте объекты ниже.
 *   name     — название модели (крупно)
 *   model    — тип/подпись (мелко)
 *   price    — цена, руб.
 *   oldPrice — старая цена для скидки (или null, если скидки нет)
 *   img      — путь к фото в assets/products/ (замените .svg на ваши .jpg)
 * Порядок в массиве = порядок карточек на странице.
 * -------------------------------------------------------------------------- */
const products = [
  // ВНИМАНИЕ: цены временные (placeholder) — замените на реальные.
  { name: 'Ракушка большая на колёсах', model: 'Стул мастера, экокожа', price: 5900,  oldPrice: null,  img: 'assets/products/p1.jpg' },
  { name: 'Лофт',      model: 'Стул лофт на металлокаркасе',       price: 8500,  oldPrice: null,  img: 'assets/products/p2.png' },
  { name: 'Кресло на деревянных ножках', model: 'Велюр, серый',     price: 7200,  oldPrice: null,  img: 'assets/products/p3.jpg' },
  { name: 'Крестовина', model: 'Пластиковая, запчасть для стула',  price: 890,   oldPrice: null,  img: 'assets/products/p4.png' },
  { name: 'Чехол',     model: 'Чехол на стул «Большая Ракушка»',   price: 1200,  oldPrice: null,  img: 'assets/products/p5.png' },
  { name: 'Ракушка большая на колёсах', model: 'Стул мастера, велюр',  price: 6400, oldPrice: null, img: 'assets/products/p6.png' },
  { name: 'Стул клиента на ножках', model: 'Экокожа, бежевый',         price: 5600, oldPrice: null, img: 'assets/products/p7.png' },
  { name: 'Комплект стул мастера и клиента', model: 'Экокожа, чёрный', price: 11000, oldPrice: 12800, img: 'assets/products/p8.png' },
  { name: 'Кресло букле на деревянных ножках', model: 'Букле, бежевый', price: 9900, oldPrice: null, img: 'assets/products/p9.png' },
  { name: 'Комплект стул мастера и клиента', model: 'Велюр, серый',  price: 12500, oldPrice: null, img: 'assets/products/p10.png' },
];

const rub = n => n.toLocaleString('ru-RU') + ' ₽';

/* ---- Рендер карточек каталога ---- */
function renderCatalog() {
  const grid = document.getElementById('catalogGrid');
  if (!grid) return;
  grid.innerHTML = products.map(p => `
    <article class="card">
      ${p.oldPrice ? '<div class="card__badge">sale</div>' : ''}
      <div class="card__media"><img src="${p.img}" alt="${p.name} — ${p.model}" loading="lazy"
        onerror="this.onerror=null;this.src='assets/products/placeholder.svg'"></div>
      <div class="card__body">
        <h3 class="card__name">${p.name}</h3>
        <p class="card__model">${p.model}</p>
        <p class="card__prices">
          <span class="card__price">${rub(p.price)}</span>
          ${p.oldPrice ? `<span class="card__old">${rub(p.oldPrice)}</span>` : ''}
        </p>
        <button class="btn btn--primary card__btn" data-order="${p.name} — ${p.model}">Заказать</button>
      </div>
    </article>
  `).join('');
}

/* ---- Мобильное меню ---- */
function initBurger() {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  if (!burger || !nav) return;
  const toggle = (open) => {
    burger.classList.toggle('is-open', open);
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
  };
  burger.addEventListener('click', () => toggle(!nav.classList.contains('is-open')));
  nav.querySelectorAll('.nav__link').forEach(link =>
    link.addEventListener('click', () => toggle(false))
  );
}

/* ---- Модальное окно заказа ---- */
function initModal() {
  const modal = document.getElementById('orderModal');
  const productLine = document.getElementById('modalProduct');
  const form = document.getElementById('orderForm');
  const success = document.getElementById('formSuccess');
  if (!modal) return;

  const open = (productName) => {
    productLine.textContent = productName ? `Товар: ${productName}` : '';
    form.hidden = false;
    success.hidden = true;
    form.reset();
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
  };
  const close = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  };

  // Кнопки "Заказать" на карточках (делегирование, т.к. карточки рендерятся динамически)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-order]');
    if (btn) open(btn.getAttribute('data-order'));
  });

  // Закрытие (крестик, фон)
  modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', close));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  // Отправка формы (заглушка — без бэкенда; см. README о подключении Formspree)
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    // TODO: здесь подключить реальную отправку (Formspree / API / mailto).
    form.hidden = true;
    success.hidden = false;
  });
}

/* ---- Тень шапки при прокрутке ---- */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 10);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---- Плавное появление блоков при прокрутке ----
 * Используем позицию элемента (getBoundingClientRect) + запасной таймер,
 * чтобы контент гарантированно показывался даже если что-то пойдёт не так. */
function initReveal() {
  document.documentElement.classList.add('js');
  const targets = [...document.querySelectorAll(
    '.advantage, .card, .about__text, .about__media, .faq__item, .hero__content'
  )];
  const reveal = (el) => el.classList.add('in');
  const inView = (el) => {
    const r = el.getBoundingClientRect();
    return r.top < (window.innerHeight || document.documentElement.clientHeight) * 0.9 && r.bottom > 0;
  };
  let ticking = false;
  const check = () => {
    ticking = false;
    targets.forEach(el => { if (!el.classList.contains('in') && inView(el)) reveal(el); });
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(check); } };

  targets.forEach((t, i) => {
    t.classList.add('reveal');
    t.style.transitionDelay = (Math.min(i % 4, 3) * 70) + 'ms';
  });
  check(); // показать то, что уже в зоне видимости
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  // страховка: через 2.5 с показываем всё в любом случае
  setTimeout(() => targets.forEach(reveal), 2500);
}

/* ---- Инициализация ---- */
document.addEventListener('DOMContentLoaded', () => {
  renderCatalog();
  initBurger();
  initModal();
  initHeaderScroll();
  initReveal();
});
