import {debounce} from "../utils/debounce.js";
import {fetchEvents} from "../utils/network-utils.js";
import {addLoader, removeLoader} from "./loader.js";

export const setupFilterSelectFields = (events) => {
  const venues = new Set(events.map(event => event.venue.location));
  const filterVenueSelect = document.querySelector('#filter-venue');
  const venueOptions = Array.from(venues).map(venue => `
    <option value='${venue}'>${venue}</option>
  `);
  venueOptions.unshift('<option value="Venue">By Venue</option>')
  filterVenueSelect.innerHTML = venueOptions.join('\n');

  const types = new Set(events.map(event => event.type));
  const filterTypeSelect = document.querySelector('#filter-type');
  const typeOptions = Array.from(types).map(type => `
    <option value='${type}'>${type}</option>
  `);
  typeOptions.unshift('<option value="Type">By Type</option>')
  filterTypeSelect.innerHTML = typeOptions.join('\n');
}

export const setupFilterListeners = (events, updateCallback) => {
  const filterVenueSelect = document.querySelector('#filter-venue');
  const filterTypeSelect = document.querySelector('#filter-type');
  const filterNameInput = document.querySelector('#filter-name');

  filterVenueSelect.addEventListener('input', debounce(handleInputEvent));
  filterTypeSelect.addEventListener('input', debounce(handleInputEvent));
  filterNameInput.addEventListener('input', debounce(handleInputEvent));

  let initialEvents = events;
  let initialName = filterNameInput.value.trim();
  let initialVenue = filterVenueSelect.value === 'Venue' ? '' : filterVenueSelect.value;
  let initialType = filterTypeSelect.value === 'Type' ? '' : filterTypeSelect.value;

  function handleInputEvent() {
    const venue = filterVenueSelect.value === 'Venue' ? '' : filterVenueSelect.value;
    const type = filterTypeSelect.value === 'Type' ? '' : filterTypeSelect.value;
    const name = filterNameInput.value.trim();
    const hasNameChanged = initialName !== name;

    if (initialVenue === venue && initialType === type) {
      if (hasNameChanged) {
        const filteredEvents = filterEventsByName(initialEvents, name);

        initialName = name;
        updateCallback(filteredEvents);
        updateUrlSearchParams(name, venue, type);
      }

      return;
    }

    const queryParams = new URLSearchParams({
      venueLocation: venue,
      eventType: type,
    });

    addLoader();
    fetchEvents(queryParams)
      .then(filteredEventsData => {
        initialEvents = filteredEventsData;
        initialName = name;
        filteredEventsData = filterEventsByName(filteredEventsData, name);

        updateCallback(filteredEventsData);
        updateUrlSearchParams(name, venue, type);
      })
      .catch(err => {
        toastr.error(err.message, 'Error');
        console.log('Error: ' + err.message);
      })
      .finally(() => {
        setTimeout(removeLoader, 250);
      });

    initialVenue = venue;
    initialType = type;
  }

  function updateUrlSearchParams(eventName, venueLocation, eventType) {
    const url = new URL(document.location);

    url.searchParams.set('eventName', eventName || '');
    url.searchParams.set('venueLocation', venueLocation || '');
    url.searchParams.set('eventType', eventType || '');
    history.pushState(null, '', url.toString());
  }
}

export const filterEventsByName = (events, name) => {
  return events.filter(event => event.name.toLowerCase().includes(name.toLowerCase()));
}
