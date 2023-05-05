"use strict";

const navbar = document.querySelector(".contenedor__navbar");
const sliders = document.querySelector(".slider");
const logo = document.querySelector(".navbar__logo");
const menu = document.querySelector(".navbar__menu");
const navbarActivado = document.querySelector(".navbar__activado");
const bar = document.querySelector(".navbar__menu__bar");


const slider = {
  container: document.querySelector('.slider-container'),
  items: document.querySelectorAll('.slider-item'),
  prevButton: document.querySelector('.slider-control-prev'),
  nextButton: document.querySelector('.slider-control-next'),
  activeIndex: 0,
  itemWidth: 0,
  timerId: null,
  transitioning: false, // nueva propiedad
  
  goToSlide(index) {
    if (this.transitioning) return; // se sale si ya se está realizando una transición
    
    this.transitioning = true; // se indica que se está realizando una transición
    
    this.items[this.activeIndex].classList.remove('active');
  
    if (index < 0) {
      this.activeIndex = this.items.length - 1;
    } else if (index >= this.items.length) {
      this.activeIndex = 0;
    } else {
      this.activeIndex = index;
    }
  
    this.items[this.activeIndex].classList.add('active');
  
    const translateX = -1 * this.activeIndex * this.itemWidth;
    this.container.style.transform = `translateX(${translateX}px)`;
    
    // se restablece la variable transitioning después de que finalice la transición
    setTimeout(() => {
      this.transitioning = false;
    }, 500); // ajusta el valor de acuerdo a la duración de la transición en CSS
  },
  
  prevSlide() {
    clearTimeout(this.timerId);
    this.goToSlide(this.activeIndex - 1);
    this.timerId = setInterval(() => this.nextSlide(), 5000);
  },
  
  nextSlide() {
    clearTimeout(this.timerId);
    this.goToSlide(this.activeIndex + 1);
    this.timerId = setInterval(() => this.nextSlide(), 5000);
  },
  
  start() {
    this.itemWidth = this.items[0].offsetWidth;
  
    this.prevButton.addEventListener('click', () => this.prevSlide());
    this.nextButton.addEventListener('click', () => this.nextSlide());
    
    this.timerId = setInterval(() => this.nextSlide(), 5000);
  },
  
  stop() {
    clearInterval(this.timerId);
  }
};

const handleIntersection = (entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      slider.start();
    } else {
      slider.stop();
    }
  });
};

const options = {
  root: null,
  rootMargin: "0px 0px 0px 0px",
  threshold: 0.2
};

const observer = new IntersectionObserver(handleIntersection, options);

observer.observe(sliders);


window.addEventListener("scroll",()=> {
  if (window.pageYOffset > 0) {
      navbar.classList.add("scrolled");
      logo.classList.add("logo--active");
  } 
  
  else {
      navbar.classList.remove("scrolled");
      logo.classList.remove("logo--active");
  }
});



menu.addEventListener("click",()=> {
  navbarActivado.classList.toggle("active");

});

menu.addEventListener("click",()=> {
  bar.classList.toggle("animate");
})



document.addEventListener('click', (event) => {

  const clicDentroDelMenu = menu.contains(event.target);
  const clicDentroDelNavbarActivado = navbarActivado.contains(event.target);
  if (!clicDentroDelMenu && !clicDentroDelNavbarActivado) {
    navbarActivado.classList.remove('active');
    bar.classList.remove("animate");
  }
});


let map = L.map('map').setView([-34.58525189629299, -58.42176379921389], 16);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


let marker = L.marker([-34.58525189629299, -58.42176379921389]).addTo(map);

let button = L.easyButton('fa-crosshairs', function(btn, map) {
  map.setView(marker.getLatLng(), 13);
});

button.addTo(map);