import {fetchEvents} from "../utils/network-utils.js";
import {createEventCard, setupEventCardListeners} from "./event-card.js";

export const createEventsComponent = () => {
  const eventsContainer = document.querySelector('.events');
  eventsContainer.innerHTML = 'No events';

  fetchEvents()
    .then(eventsData => {
      if (eventsData.length) {
        eventsContainer.innerHTML = '';
        eventsData.forEach(ev => {
          const eventCard = createEventCard(ev);
          eventsContainer.appendChild(eventCard);
          setupEventCardListeners(ev);
        });
      }
    })
    .catch(err => {
      toastr.error(err.message, 'Error');
      console.log('Error: ' + err.message);
    });
}
