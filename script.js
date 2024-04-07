'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Smooth scrolling

let btnScrollTo = document.querySelector('.btn--scroll-to');
let section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', e => {
  e.preventDefault();
  let s1coor = section1.getBoundingClientRect();
  console.log(e.target.getBoundingClientRect());
  console.log(s1coor);

  console.log(window.screenX, window.scrollY);

  // window.scrollTo(s1coor.left + window.scrollX, s1coor.top + window.scrollY);

  // old method :

  // window.scrollTo({
  //   left: s1coor.left + window.scrollX,
  //   top: s1coor.top + window.scrollY,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});

let h1 = document.querySelector('h1');

// h1.addEventListener('mouseenter', () => (h1.style.color = 'red'));

// h1.addEventListener('mouseleave', () => (h1.style.color = ''));

h1.addEventListener('drag', () => (h1.style.color = 'red'));

// window.addEventListener('contextmenu', e => e.preventDefault());

let operationTabsContainer = document.querySelector(
  '.operations__tab-container'
);
let operationTabsContent = document.querySelectorAll('.operations__content');

let operationTabs = [...operationTabsContainer.children];

operationTabsContainer.addEventListener('click', e => {
  let clicked = e.target.closest('.operations__tab');
  if (!clicked) return;
  operationTabs.forEach(t => t.classList.remove('operations__tab--active'));

  clicked.classList.add('operations__tab--active');

  console.log(clicked.dataset.tab);

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
  let content = document.querySelector(
    `.operations__content--${clicked.dataset.tab}`
  );

  console.log(operationTabsContent);

  operationTabsContent.forEach(c =>
    c.classList.remove('operations__content--active')
  );

  content.classList.add('operations__content--active');
});

let nav = document.querySelector('.nav');

// nav.addEventListener('click', e => e.preventDefault());

const handleNavHover = function (e) {
  const link = e.target;

  let sibling = link.closest('.nav').querySelectorAll('.nav__link');
  let logo = link.closest('.nav').querySelector('img');

  if (link.classList.contains('nav__link')) {
    sibling.forEach(t => {
      if (t != link) t.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleNavHover.bind(0.5));

nav.addEventListener('mouseout', handleNavHover.bind(1));

// navigation sticky
// let initialcoordinates = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialcoordinates.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// Alternate sticky navigation

const header = document.querySelector('.header');
const navheight = nav.getBoundingClientRect().height;

let handleNavSticky = function (entries, observer) {
  let [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

let NavStrickyObserverOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navheight}px`,
};

const navobserver = new IntersectionObserver(
  handleNavSticky,
  NavStrickyObserverOptions
);

navobserver.observe(header);

const sections = document.querySelectorAll('.section');

let revealSection = function (entries, observer) {
  let [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

sections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy img

let lazyImg = document.querySelectorAll('img[data-src]');

let LazyImgHandle = function (entries, observer) {
  let [entry] = entries;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const LazyImgObserver = new IntersectionObserver(LazyImgHandle, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

lazyImg.forEach(img => LazyImgObserver.observe(img));

// Slider
//
//

let slides = document.querySelectorAll('.slide');
let maxSlides = slides.length;
let sliderPrevBtn = document.querySelector('.slider__btn--left');
let sliderNextBtn = document.querySelector('.slider__btn--right');

let curslide = 0;

let dotContainer = document.querySelector('.dots');

let slider = function () {
  // functions
  let createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  let activeDot = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => {
      dot.classList.remove('dots__dot--active');
      document
        .querySelector(`.dots__dot[data-slide="${slide}"]`)
        .classList.add('dots__dot--active');
    });
  };

  let goToSlide = function (slideNo) {
    slides.forEach(function (slide, i) {
      slide.style.transform = `translateX(${100 * (i - slideNo)}%)`;
    });
  };

  let nextSlide = function () {
    if (curslide < maxSlides - 1) curslide++;
    goToSlide(curslide);
    activeDot(curslide);
  };
  let prevSlide = function () {
    if (curslide != 0) curslide--;
    else curslide = maxSlides - 1;
    goToSlide(curslide);
    activeDot(curslide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activeDot(0);
  };
  init();

  // event handlers
  sliderPrevBtn.addEventListener('click', prevSlide);
  sliderNextBtn.addEventListener('click', nextSlide);
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  // Dots --> Slide

  dotContainer.addEventListener('click', e => {
    if (e.target.classList.contains('dots__dot')) {
      let { slide } = e.target.dataset;
      goToSlide(slide);
      activeDot(slide);
    }
  });
};

slider();

// Create Account

const formCreate = document.querySelector('.modal__form');
const btnNextStep = document.querySelector('.btn--nextstep');
const firstNameInput = document.querySelector('.model__form__firstname');
const lastNameInput = document.querySelector('.model__form__lastname');
const emailInput = document.querySelector('.model__form__email');

btnNextStep.addEventListener('click', e => {
  e.preventDefault();
  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const email = emailInput.value;
  const owner = firstName + ' ' + lastName;
  const userName = owner
    .toLowerCase()
    .split(' ')
    .map(name => name[0])
    .join('');

  let accounts = JSON.parse(localStorage.getItem('accounts')) || [];

  let userExist = accounts.find(account => account.email == email);
  console.log(userExist);
  if (userExist) return;

  formCreate.innerHTML = ` <label>User Name</label>
  <input type="text" class="model__form__username" readonly value="${userName}" />
  <label>Pin</label>
  <input type="password" class="model__form__pin" />
  <label>Confirm Pin</label>
  <input type="password" class="model__form__confirmpin" />
  <button class="btn btn--finish">Finish &rarr;</button>`;

  let btnFinish = document.querySelector('.btn--finish');
  btnFinish.addEventListener('click', e => {
    e.preventDefault();
    const pin = document.querySelector('.model__form__pin');
    const confirmPin = document.querySelector('.model__form__confirmpin');
    if (pin.value != confirmPin.value) {
      alert('Pin should match..!');
      pin.value = confirmPin.value = '';
      return;
    } else {
      let account = {
        owner,
        email,
        movements: [],
        interestRate: 1.2,
        pin: Number(pin.value),
        movementsDates: [],
        currency: 'IND',
        locale: 'en-US',
      };
      accounts.push(account);
      localStorage.setItem('accounts', JSON.stringify(accounts));
      console.log(account);
    }
    formCreate.innerHTML = ` <label>Your Account Created Successfully</label>
  <button class="btn btn--finish" >Go to Account &rarr;</button>`;
    console.log('Account Create Successfully');
    setTimeout(() => {
      window.location.href = `bank/index.html`;
    }, 3000);
  });
});

console.log(window.location.host);
