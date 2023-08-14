import {useStyle} from "./styles.js";
import {postOrder} from "../utils/network-utils.js";

export const createEventCard = (eventData) => {
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
    <img src="${eventData.image}" alt="${eventCard.name}" class="event-image w-full h-auto object-cover rounded-2xl">
    <div class="px-4 pt-4 space-y-1.5">
      <header>
        <h2 class="event-title text-2xl font-bold">${eventData.name}</h2>
      </header>
      <div>
        <p class="text-gray-600">${eventData.description}</p>
        <h3 class="mt-4 mb-1 font-semibold text-lg">Ticket Category</h3>
        <select id="select-${eventData.id}" class="block h-8 w-full mb-3 outline outline-1 rounded-md disabled:text-gray-500 disabled:opacity-60" ${eventData.ticketCategories.length === 1 ? "disabled" : ""}>
          ${ticketCategoryOptions.join('\n')}
        </select>
        <div class="flex flex-row gap-x-2">
          <input id="input-${eventData.id}" type="number" class="text-center font-semibold w-16 grow-0 border border-slate-700 rounded-md" value="0" size="4" maxlength="4" min="0" step="1">
          <button id="plus-button-${eventData.id}" class="text-white bg-orange-600 p-2 rounded hover:bg-orange-700">
            <i class="fa-solid fa-plus"></i>
          </button>
          <button id="minus-button-${eventData.id}" class="text-white bg-slate-600 p-2 rounded hover:bg-slate-700 disabled:bg-slate-600/70" disabled>
            <i class="fa-solid fa-minus"></i>
          </button>
        </div>
      </div>
      <footer class="pt-2">
        <button id="buy-button-${eventData.id}" class="bg-amber-700 text-white p-4 rounded-2xl w-24 hover:bg-amber-800 hover:shadow-md hover:shadow-gray-500/40 disabled:bg-amber-700/70 disabled:shadow-none" disabled>Buy</button>
      </footer>
    </div>
  `;
  eventCard.innerHTML = eventCardContent;

  return eventCard;
}

export const setupEventCardListeners = (eventData) => {
  const buyButton = document.querySelector(`#buy-button-${eventData.id}`);
  const plusButton = document.querySelector(`#plus-button-${eventData.id}`);
  const minusButton = document.querySelector(`#minus-button-${eventData.id}`);
  const ticketCategorySelect = document.querySelector(`#select-${eventData.id}`);
  const numberOfTicketsInput = document.querySelector(`#input-${eventData.id}`);

  plusButton.addEventListener('click', () => {
    let numberOfTickets = parseInt(numberOfTicketsInput.value);
    numberOfTickets++;

    numberOfTicketsInput.value = numberOfTickets;
    if (numberOfTickets > 0) {
      buyButton.disabled = false;
      minusButton.disabled = false;
    }
  });

  minusButton.addEventListener('click', () => {
    let numberOfTickets = parseInt(numberOfTicketsInput.value);
    numberOfTickets--;

    numberOfTicketsInput.value = numberOfTickets;
    if (numberOfTickets === 0) {
      buyButton.disabled = true;
      minusButton.disabled = true;
    }
  });

  numberOfTicketsInput.addEventListener('input', () => {
    const numberOfTickets = parseInt(numberOfTicketsInput.value);

    if (numberOfTickets > 0) {
      buyButton.disabled = false;
      minusButton.disabled = false;
    } else {
      buyButton.disabled = true;
      minusButton.disabled = true;
    }
  });

  buyButton.addEventListener('click', () => {
    const ticketCategoryId = parseInt(ticketCategorySelect.value);
    const numberOfTickets = parseInt(numberOfTicketsInput.value);
    const eventId = eventData.id;

    postOrder(eventId, ticketCategoryId, numberOfTickets)
      .then(o => {
        console.log("Done", o);

        numberOfTicketsInput.value = 0;
        buyButton.disabled = true;
        minusButton.disabled = true;
        ticketCategorySelect.selectedIndex = 0;
      });
  });
}
