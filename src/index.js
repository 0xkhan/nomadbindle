import SassyModal from './js/plugins/SassyModal';
import CtrlView from './js/plugins/CtrlView';
import router from './js/plugins/SPARouter';
import { resizeTextarea, navMarker } from './js/components/components';
import { dataModalGoal } from './js/data/data';

import logo from './assets/logo.svg';
import baliImg from './assets/bali.jpg';

import './js/tests/dataModalGoal.test.js';

// Selectors
const logoElem = document.querySelector('#logo');
const menuBtn = document.querySelector('.nav__menu-btn');
const navIcon = document.querySelector('.nav__icon');
const menuList = document.querySelector('.nav__list');
const header = document.querySelector('header');
const footer = document.querySelector('footer');
const mainContent = document.querySelector('.main-content');
const footerNavMarker = document.querySelector('.footer-nav__marker');
const footerNavItems = document.querySelectorAll('.footer-nav__link');
const modalNavMarker = document.querySelector('.modal__nav-marker');
const modalNavItems = document.querySelectorAll('.modal__nav-btn');
const addAllModalClose = document.querySelector('[data-modal-close="add-all"]');

logoElem.style.backgroundImage = `url(${logo})`;

// Shows nav items
const showMenu = function() {
    menuBtn.addEventListener('click', () => {
        menuList.classList.toggle('nav__show-list');
        navIcon.classList.toggle('rotate');
    });
};

// Gets computed styles - used for calculating viewport height
const getStyle = function(elem, attribute) {
    const computedStyles = window.getComputedStyle(elem);
    const computedValue = computedStyles.getPropertyValue(attribute);

    return computedValue;
};

// Main content
const setViewPort = function() {
    const headerHeight = +getStyle(header, 'height').split('px')[0];
    const headerMargin = +getStyle(header, 'margin-top').split('px')[0];
    const footerHeight = +getStyle(footer, 'height').split('px')[0];
    const takenHeightPx = headerHeight + headerMargin + footerHeight;
    const viewPortHeight = window.visualViewport.height;
    const takenHeightPercent = (takenHeightPx / viewPortHeight) * 100;
    mainContent.style.minHeight = `${100 - takenHeightPercent}vh`;
};

// After modal is closed move the footer nav marker to initial point i.e first item
addAllModalClose.addEventListener('click', () => {
    navMarker(footerNavMarker, footerNavItems);
});

// Sub-modal confirm
const fillModalForm = function() {
    const submits = document.querySelectorAll('[data-submodal-confirm]');

    if (submits.length > 0) {
        submits.forEach((submit) => {
            submit.addEventListener('click', (event) => {
                event.preventDefault();
                const subModalID = event.target.getAttribute('data-submodal-confirm');
                setValue({ subModalID: subModalID });
            });
        });
    }
};

const setValue = function({ subModalID }) {
    const targetIDArray = subModalID.split('-');
    const targetID = targetIDArray.length > 2 ? `${targetIDArray[0]}-${targetIDArray[1]}` : subModalID;
    const viewValue = document.querySelector(`[data-submodal-viewValue=${targetID}]`);
    const inputValue = document.querySelector(`[data-submodal-inputValue=${targetID}]`);
    const value = getValue({ subModalID });

    viewValue.innerText = subModalID === 'trip-budget' ? `$${value}` : value;
    inputValue.value = value;

    // Close Modal
    submodal.closeModal({ modalID: targetID });
};

const getValue = function({ subModalID }) {
    const elem = document.querySelector(`[data-submodal-input=${subModalID}]`);
    let inputValue;

    if (elem.tagName == 'INPUT') {
        inputValue = elem.value;
    } else {
        inputValue = elem.innerText;
    }

    return inputValue;
};

// Just temprory solution for showing something in modal
const renderGoalModal = function({ data }) {
    const elem = document.querySelector('[data-elem-id="form-goal"]');

    const chevron = data.commonChevron;
    const button = `
        <div class="modal-form__extras-group u-center-text">
            <button id="submit" class="btn btn--default" type="submit">Add Goal</button>
        </div>
    `;

    elem.innerHTML = '';

    data.dataArray.forEach((data) => {
        const markup = `
            <div class="modal-form__extras-group">
                <a href="#" data-submodal-trigger="goal-activity">
                    <label class="modal-form__label" for="">
                        <span class="modal-form__label-icon">
                            ${data.icon}
                        </span>
                        <span class="modal-form__label-text" data-submodal-viewValue="goal-activity">
                            ${data.name}
                        </span>
                        <span class="modal-form__label-chevron">
                            ${chevron}
                        </span>
                    </label>
                </a>
                <input id="list-cat" data-submodal-inputValue="goal-activity" class="modal-form__input modal-form__input--cat" type="hidden" >
            </div>
        `;
        elem.insertAdjacentHTML('beforeend', markup);
    });

    elem.insertAdjacentHTML('beforeend', button);
};

// Instantiate SPA Router
const routes = {
    404: {
        template: './templates/404.html',
        title: '404 Not Found',
        description: 'This is the 404 page.'
    },
    '/': {
        template: './templates/home.html',
        title: 'Nomad Bindle',
        description: 'Achieve your bucket list goals with ease and fun.'
    },
    '/map': {
        template: './templates/map.html',
        title: 'Map - Nomad Bindle',
        description: 'Achieve your bucket list goals with ease and fun.'
    }
};

router.setRoutes(routes).initRouter({ selector: '.footer-nav a' });

// Loads map
const loadMap = function() {
    const body = document.querySelector('body');
    if (window.location.pathname === "/map") {
        const mapContainer = '<div id="map"></div>';
        body.insertAdjacentHTML('beforeend', mapContainer);

        const map = L.map('map').setView([51.505, -0.09], 13);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    }
}

// Instantiate Sassy Modal
const modal = new SassyModal({
    blur: false,
    centered: true,
    animation: 'fade-out',
    showModalCSS: 'show-modal'
});

const submodal = new SassyModal({
    blur: false,
    centered: true,
    animation: 'fade-in',
    showModalCSS: 'show-modal',
    dataAttributes: {
        trigger: 'data-submodal-trigger',
        closer: 'data-submodal-close',
        id: 'data-submodal-id'
    }
});

// Instantiate Ctrl View
const ctrlView = new CtrlView({
    activateElemCSS: "modal__form-extras--activate"
});

const init = function() {
    setViewPort();
    showMenu();
    resizeTextarea();
    fillModalForm();
    navMarker(footerNavMarker, footerNavItems);
    navMarker(modalNavMarker, modalNavItems);
    renderGoalModal({ data: dataModalGoal });
    loadMap();
};

init();
