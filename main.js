import {createEventsComponent} from "./src/components/events.js";
import {createOrdersComponent} from "./src/components/orders.js";

// Navigate to a specific URL
function navigateTo(url) {
  history.pushState(null, null, url);
  renderContent(url);
}

// HTML templates
function getHomePageTemplate() {
  return `
    <div id="content" class="flex flex-col items-center">
      <img src="./src/assets/Endava.png" alt="summer">
      <div class="grid grid-cols-2 gap-4 w-3/4 md:w-1/4 mt-8 p-4">
        <h2 class="text-3xl text-[#de411b] font-semibold col-span-2 justify-self-center">Filter events</h2>
        <input type="text" id="filter-name" class="col-span-2 h-8 p-2 border border-slate-700 rounded-md" placeholder="Event name">
        <select id="filter-venue" class="h-8 outline outline-1 rounded-md truncate">
        </select>
        <select id="filter-type" class="h-8 outline outline-1 rounded-md truncate">
        </select>
      </div>
      <div class="events grid md:grid-cols-2 w-4/5 lg:grid-cols-3 items-stretch mt-1 p-4 gap-4">
      </div>
    </div>
  `;
}

function getOrdersPageTemplate() {
  return `
    <div id="content" class="flex portrait:items-stretch landscape:items-center flex-col portrait:overflow-x-auto portrait:min-w-min px-2">
      <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
      <table id="orders-content" class="order-table border-collapse table-auto">
        <thead>
        </thead>
        <tbody>
        </tbody>
      </table>
    </div>
  `;
}

function setupNavigationEvents() {
  const navLinks = document.querySelectorAll('nav a');

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();

      const href = link.getAttribute('href');
      navigateTo(href);
    });
  });
}

function setupMobileMenuEvent() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

function setupPopstateEvent() {
  window.addEventListener('popstate', () => {
    const currentUrl = window.location.pathname;
    renderContent(currentUrl);
  });
}

function setupInitialPage() {
  const initialUrl = window.location.pathname;
  renderContent(initialUrl);
}

function renderHomePage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getHomePageTemplate();

  createEventsComponent();
}

function renderOrdersPage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();

  createOrdersComponent();
}

// Render content based on URL
function renderContent(url) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = '';

  if (url === '/') {
    renderHomePage();
  } else if (url === '/orders') {
    renderOrdersPage()
  }
}


// Call the setup functions
setupNavigationEvents();
setupMobileMenuEvent();
setupPopstateEvent();
setupInitialPage();
