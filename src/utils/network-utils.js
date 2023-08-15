const BASE_URL_JAVA = 'http://localhost:8080';
const BASE_URL_NET = 'http://localhost:8081';

// TODO: Better error messages in exceptions, needs backend changes

export async function fetchEvents() {
  const response = await fetch(`${BASE_URL_JAVA}/api/events`, {
    mode: 'cors'
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const data = await response.json();

  return data;
}

export async function fetchOrders() {
  const response = await fetch(`${BASE_URL_JAVA}/api/orders`, {
    mode: 'cors'
  });
  if (!response.ok) {
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
    throw new Error(response.statusText);
  }

  const data = await response.json();

  return data;
}
