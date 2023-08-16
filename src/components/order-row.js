export const createOrderRow = (order) => {
  const orderRow = document.createElement('tr');
  orderRow.id = `order-${order.id}`;

  const ticketCategoryOptions = order.event.ticketCategories
    .map(tc => `
      <option value="${tc.id}" ${tc.id === order.ticketCategory.id ? 'selected' : ''}>${tc.description} - $${tc.price}</option>
    `);

  const rowContent = `
    <td class="order-table">${order.event.name}</td>
    <td class="order-table">${new Date(order.timestamp).toLocaleDateString()}</td>
    <td class="order-table">
      <select id="select-${order.id}" class="hidden w-fit text-orange-700 outline outline-2 outline-orange-700 rounded-md">
        ${ticketCategoryOptions.join('\n')}
      </select>
      <span id="ticket-category-${order.id}">${order.ticketCategory.description}</span>
    </td>
    <td class="order-table">
      <input id="input-${order.id}" type="number" min="1" step="1" value="${order.numberOfTickets}" class="hidden w-16 text-orange-700 border-2 border-orange-700 outline-none rounded-md">
      <span id="number-tickets-${order.id}">${order.numberOfTickets}</span>
    </td>
    <td class="order-table">$${order.totalPrice}</td>
    <td class="order-table">
      <span class="flex justify-center gap-2">
        <button id="confirm-${order.id}" class="hidden hover:text-green-700">
          <i class="fa-solid fa-check"></i>
        </button>
        <button id="cancel-${order.id}" class="hidden hover:text-red-700">
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

export const setupOrderRowListeners = (order) => {
  const editButton = document.querySelector(`#edit-${order.id}`);
  const confirmButton = document.querySelector(`#confirm-${order.id}`);
  const cancelButton = document.querySelector(`#cancel-${order.id}`);
  const ticketCategorySelect = document.querySelector(`#select-${order.id}`);
  const numberOfTicketsInput = document.querySelector(`#input-${order.id}`);
  const ticketCategorySpan = document.querySelector(`#ticket-category-${order.id}`);
  const numberOfTicketsSpan = document.querySelector(`#number-tickets-${order.id}`);

  numberOfTicketsInput.addEventListener('change', () => {
    const numberOfTickets = numberOfTicketsInput.value;

    if (numberOfTickets === '' || parseInt(numberOfTickets) <= 0) {
      numberOfTicketsInput.value = 1;
    }
  });

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
