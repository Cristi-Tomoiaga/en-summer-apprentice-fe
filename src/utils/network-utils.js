const BASE_URL_JAVA = 'http://localhost:8080';
const BASE_URL_NET = 'http://localhost:8081';

export async function fetchEvents(query = null) {
  const fetchUrl = query === null ? `${BASE_URL_JAVA}/api/events`
                                         : `${BASE_URL_JAVA}/api/events?${query.toString()}`;

  const response = await fetch(fetchUrl, {
    mode: 'cors'
  });
  if (!response.ok) {
    const errorText = await response.text();

    if (errorText.length > 0) {
      const errorObject = JSON.parse(errorText);
      throw new Error(errorObject.errorMessage);
    }

    throw new Error(response.statusText);
  }

  const data = await response.json();

  return data;
}

export async function fetchCategoriesAndVenues() {
  const events = await fetchEvents();
  const venues = new Set(events.map(event => event.venue.location));
  const types = new Set(events.map(event => event.type));

  return {
    venues: Array.from(venues),
    types: Array.from(types),
  };
}

export async function fetchOrders() {
  const response = await fetch(`${BASE_URL_JAVA}/api/orders`, {
    mode: 'cors'
  });
  if (!response.ok) {
    const errorText = await response.text();

    if (errorText.length > 0) {
      const errorObject = JSON.parse(errorText);
      throw new Error(errorObject.errorMessage);
    }

    throw new Error(response.statusText);
  }

  const data = await response.json();

  return data;
}

export async function postOrder(eventId, ticketCategoryId, numberOfTickets) {
  const response = await fetch(`${BASE_URL_JAVA}/api/orders`, {
    mode: 'cors',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      eventId,
      ticketCategoryId,
      numberOfTickets
    })
  });
  if (!response.ok) {
    const errorText = await response.text();

    if (errorText.length > 0) {
      const errorObject = JSON.parse(errorText);
      throw new Error(errorObject.errorMessage);
    }

    throw new Error(response.statusText);
  }

  const data = await response.json();

  return data;
}

export async function updateOrder(orderId, ticketCategoryId, numberOfTickets) {
  const response = await fetch(`${BASE_URL_NET}/api/orders/${orderId}`, {
    mode: 'cors',
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ticketCategoryId,
      numberOfTickets
    })
  });
  if (!response.ok) {
    const errorText = await response.text();

    if (errorText.length > 0) {
      const errorObject = JSON.parse(errorText);
      throw new Error(errorObject.errorMessage);
    }

    throw new Error(response.statusText);
  }

  const data = await response.json();

  return data;
}

export async function deleteOrder(orderId) {
  const response = await fetch(`${BASE_URL_NET}/api/orders/${orderId}`, {
    mode: 'cors',
    method: 'DELETE'
  });

  if (!response.ok) {
    const errorText = await response.text();

    if (errorText.length > 0) {
      const errorObject = JSON.parse(errorText);
      throw new Error(errorObject.errorMessage);
    }

    throw new Error(response.statusText);
  }
}
