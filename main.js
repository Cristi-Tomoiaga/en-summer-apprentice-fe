import {useStyle} from './src/components/styles.js';
import {fetchOrders} from "./src/utils/network-utils.js";
import {createEventsComponent} from "./src/components/events.js";

// Navigate to a specific URL
function navigateTo(url) {
  history.pushState(null, null, url);
  renderContent(url);
}

// HTML templates
function getHomePageTemplate() {
  return `
    <div id="content">
      <img src="./src/assets/Endava.png" alt="summer">
      <div class="events grid md:grid-cols-2 lg:grid-cols-3 items-stretch mt-8 p-4 gap-4">
      </div>
    </div>
  `;
}

function getOrdersPageTemplate() {
  return `
    <div id="content" class="flex portrait:items-stretch landscape:items-center flex-col portrait:overflow-x-auto portrait:min-w-min px-2">
      <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
      <table id="orders-content" class="order-table border-collapse table-auto">
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

function renderOrdersPage(categories) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();

  addOrders();
}

const addOrders = () => {
  const contentDiv = document.querySelector("#orders-content");
  contentDiv.innerHTML = 'No orders';

  fetchOrders()
    .then(orders => {
      if (orders.length) {
        contentDiv.innerHTML = '';
        contentDiv.appendChild(createOrderHeader());
        setupOrderHeaderListeners();

        orders.forEach(o => {
          const orderRow = createOrderRow(o);
          contentDiv.appendChild(orderRow);
          setupOrderRowListeners(o);
        });
      }
    })
}

const createOrderHeader = () => {
  const orderHeader = document.createElement('tr');
  orderHeader.classList.add(...useStyle("orderHeader"));

  const tableHeaderContent = `
    <th class="order-table">
      <button id="sort-name-button">
        Event Name
        <i class="fa-solid fa-arrow-up-wide-short" id="sort-name-icon"></i> <!-- fa-arrow-down-wide-short -->
      </button>
    </th>
    <th class="order-table">Date</th>
    <th class="order-table">Ticket Category</th>
    <th class="order-table">Number of Tickets</th>
    <th class="order-table">
      <button id="sort-price-button">
        Total Price
        <i class="fa-solid fa-arrow-up-wide-short" id="sort-price-icon"></i> <!-- fa-arrow-down-wide-short -->
      </button>
    </th>
    <th class="order-table w-32">Actions</th>
  `;

  orderHeader.innerHTML = tableHeaderContent;
  return orderHeader;
}

const setupOrderHeaderListeners = () => {
  const sortNameButton = document.querySelector('#sort-name-button');
  const sortPriceButton = document.querySelector('#sort-price-button');
  const sortNameIcon = document.querySelector('#sort-name-icon');
  const sortPriceIcon = document.querySelector('#sort-price-icon');

  const arrowUpClass = 'fa-arrow-up-wide-short';
  const arrowDownClass = 'fa-arrow-down-wide-short';

  sortNameButton.addEventListener('click', () => {
    sortNameIcon.classList.toggle(arrowUpClass);
    sortNameIcon.classList.toggle(arrowDownClass);
  });

  sortPriceButton.addEventListener('click', () => {
    sortPriceIcon.classList.toggle(arrowUpClass);
    sortPriceIcon.classList.toggle(arrowDownClass);
  });
}

const createOrderRow = (order) => {
  const orderRow = document.createElement('tr');

  const ticketCategoryOptions = order.event.ticketCategories
    .map(tc => `
      <option value="${tc.id}" ${tc.id === order.ticketCategory.id ? 'selected' : ''}>${tc.description} - $${tc.price}</option>
    `);

  const rowContent = `
    <td class="order-table">${order.event.name}</td>
    <td class="order-table">${new Date(order.timestamp).toLocaleDateString()}</td>
    <td class="order-table">
      <select id="select-${order.id}" class="hidden w-fit outline outline-1 rounded-md">
        ${ticketCategoryOptions.join('\n')}
      </select>
      <span id="ticket-category-${order.id}">${order.ticketCategory.description}</span>
    </td>
    <td class="order-table">
      <input id="input-${order.id}" type="number" min="1" step="1" value="${order.numberOfTickets}" class="hidden w-16 border border-slate-700 rounded-md">
      <span id="number-tickets-${order.id}">${order.numberOfTickets}</span>
    </td>
    <td class="order-table">$${order.totalPrice}</td>
    <td class="order-table">
      <span class="flex justify-center gap-2">
        <button id="confirm-${order.id}" class="hidden">
          <i class="fa-solid fa-check"></i>
        </button>
        <button id="cancel-${order.id}" class="hidden">
          <i class="fa-solid fa-xmark"></i>
        </button>
        <button id="edit-${order.id}">
          <i class="fa-solid fa-pencil"></i>
        </button>
        <button id="delete-${order.id}">
          <i class="fa-solid fa-trash-can text-amber-700"></i>
        </button>
      </span>
    </td>
  `;

  orderRow.innerHTML = rowContent;
  return orderRow;
}

const setupOrderRowListeners = (order) => {
  const editButton = document.querySelector(`#edit-${order.id}`);
  const confirmButton = document.querySelector(`#confirm-${order.id}`);
  const cancelButton = document.querySelector(`#cancel-${order.id}`);
  const ticketCategorySelect = document.querySelector(`#select-${order.id}`);
  const numberOfTicketsInput = document.querySelector(`#input-${order.id}`);
  const ticketCategorySpan = document.querySelector(`#ticket-category-${order.id}`);
  const numberOfTicketsSpan = document.querySelector(`#number-tickets-${order.id}`);

  editButton.addEventListener('click', () => {
    editButton.classList.add('hidden');
    confirmButton.classList.remove('hidden');
    cancelButton.classList.remove('hidden');

    ticketCategorySelect.classList.remove('hidden');
    numberOfTicketsInput.classList.remove('hidden');
    ticketCategorySpan.classList.add('hidden');
    numberOfTicketsSpan.classList.add('hidden');
  });

  cancelButton.addEventListener('click', () => {
    editButton.classList.remove('hidden');
    confirmButton.classList.add('hidden');
    cancelButton.classList.add('hidden');

    ticketCategorySelect.classList.add('hidden');
    numberOfTicketsInput.classList.add('hidden');
    ticketCategorySpan.classList.remove('hidden');
    numberOfTicketsSpan.classList.remove('hidden');
  });
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
