import {fetchEvents} from "../utils/network-utils.js";
import {createEventCard, setupEventCardListeners} from "./event-card.js";
import {addLoader, removeLoader} from "./loader.js";
import {setupFilterSelectFields, setupFilterListeners} from "./filter-events.js";

export const createEventsComponent = () => {
  const eventsContainer = document.querySelector('.events');
  eventsContainer.innerHTML = 'No events';

  addLoader();
  fetchEvents()
    .then(eventsData => {
      if (eventsData.length) {
        eventsContainer.innerHTML = '';

        setupFilterSelectFields(eventsData);
        setupFilterListeners(eventsData, (filteredEventsData) => {
          if (filteredEventsData.length) {
            eventsContainer.innerHTML = '';
            createEventsCards(eventsContainer, filteredEventsData);
          } else {
            eventsContainer.innerHTML = 'No events';
          }
        });

        createEventsCards(eventsContainer, eventsData);
      }
    })
    .catch(err => {
      toastr.error(err.message, 'Error');
      console.log('Error: ' + err.message);
    })
    .finally(() => {
      setTimeout(removeLoader, 250);
    });
}

const createEventsCards = (eventsContainer, eventsData) => {
  eventsData.forEach(ev => {
    const eventCard = createEventCard(ev);

    eventsContainer.appendChild(eventCard);
    setupEventCardListeners(ev);
  });
}
