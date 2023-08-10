import {useStyle} from './src/components/styles.js';

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
      <div class="events flex items-center justify-center flex-wrap mt-8">
      </div>
    </div>
  `;
}

function getOrdersPageTemplate() {
  return `
    <div id="content">
      <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
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

  // Sample hardcoded event data
  const eventData = {
    id: 1,
    venue: {
      id: 1,
      location: 'Cluj-Napoca',
      type: 'Hotel Lobby',
      capacity: 100
    },
    type: 'Conference',
    description: 'Sample event description.',
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    name: 'Sample Event',
    ticketCategories: [
      { id: 1, description: 'General Admission', price: 800.0 },
      { id: 2, description: 'VIP', price: 1500.0 },
    ],
  };

  const eventsContainer = document.querySelector('.events');

  // Append the event card to the events container
  eventsContainer.appendChild(createEvent(eventData));
  eventsContainer.appendChild(createEvent(eventData));
}

const createEvent = (eventData) => {
  // Create the event card element
  const eventCard = document.createElement('div');
  eventCard.classList.add(...useStyle('eventCard'));
  eventCard.classList.add('event-card');

  // Create the option elements for the ticket categories
  const ticketCategoryOptions = eventData.ticketCategories
    .map(tc => `
      <option value="${tc.id}">${tc.description} - $${tc.price}</option>
    `);

  // Create the event content markup
  const eventCardContent = `
    <img src="${eventData.img}" alt="${eventCard.name}" class="event-image w-full h-auto object-cover rounded-2xl">
    <div class="px-4 pt-4 space-y-1.5">
      <header>
        <h2 class="event-title text-2xl font-bold">${eventData.name}</h2>
      </header>
      <div>
        <p class="text-gray-600">${eventData.description}</p>
        <h3 class="mt-4 mb-1 font-semibold text-lg">Ticket Category</h3>
        <select class="block h-8 w-full mb-3 outline outline-1 rounded-md">
          ${ticketCategoryOptions.join('\n')}
        </select>
        <div class="flex flex-row gap-x-2">
          <input type="number" class="text-center font-semibold w-16 grow-0 border border-slate-700 rounded-md" value="0" size="4" maxlength="4" min="0" step="1">
          <button class="text-white bg-orange-600 p-2 rounded hover:bg-orange-700">
            <i class="fa-solid fa-plus"></i>
          </button>
          <button class="text-white bg-slate-600 p-2 rounded hover:bg-slate-700">
            <i class="fa-solid fa-minus"></i>
          </button>
        </div>
      </div>
      <footer class="pt-2">
        <button class="bg-amber-700 text-white p-4 rounded-2xl w-24 hover:bg-amber-800 hover:shadow-md hover:shadow-gray-500/40">Buy</button>
      </footer>
    </div>
  `;
  eventCard.innerHTML = eventCardContent;

  return eventCard;
}

function renderOrdersPage(categories) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();
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
