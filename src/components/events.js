import {fetchEvents} from "../utils/network-utils.js";
import {createEventCard, setupEventCardListeners} from "./event-card.js";
import {addLoader, removeLoader} from "./loader.js";

export const createEventsComponent = () => {
  const eventsContainer = document.querySelector('.events');
  eventsContainer.innerHTML = 'No events';

  addLoader();
  fetchEvents()
    .then(eventsData => {
      if (eventsData.length) {
        eventsContainer.innerHTML = '';
        eventsData.forEach(ev => {
          const eventCard = createEventCard(ev);
          eventsContainer.appendChild(eventCard);
          setupEventCardListeners(ev);
        });

        setTimeout(removeLoader, 250);
      }
    })
    .catch(err => {
      toastr.error(err.message, 'Error');
      console.log('Error: ' + err.message);
    });
}
