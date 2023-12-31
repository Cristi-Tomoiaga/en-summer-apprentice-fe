import {fetchCategoriesAndVenues, fetchEvents} from "../utils/network-utils.js";
import {createEventCard, setupEventCardListeners} from "./event-card.js";
import {addLoader, removeLoader} from "./loader.js";
import {setupFilterFields, setupFilterListeners, filterEventsByName} from "./filter-events.js";

export const createEventsComponent = () => {
  const eventsContainer = document.querySelector('.events');
  eventsContainer.innerHTML = 'No events';

  const {searchName, searchParams} = parseSearchParams(new URL(document.location).searchParams);

  addLoader();
  Promise.all([fetchEvents(searchParams), fetchCategoriesAndVenues()])
    .then(result => {
      let [eventsData, {venues, types}] = result;

      if (eventsData.length) {
        eventsContainer.innerHTML = '';

        if (searchName !== '') {
          eventsData = filterEventsByName(eventsData, searchName);
        }

        setupFilterFields(venues, types, searchName, searchParams);
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

const parseSearchParams = (initialSearchParams) => {
  const eventName = initialSearchParams.get('eventName') || '';
  initialSearchParams.delete('eventName');

  const venueLocation = initialSearchParams.get('venueLocation') || '';
  const eventType = initialSearchParams.get('eventType') || '';
  const parsedSearchParams = new URLSearchParams({
    venueLocation,
    eventType,
  });

  return {
    searchName: eventName.trim(),
    searchParams: parsedSearchParams,
  };
}
