import {deleteOrder, updateOrder} from "../utils/network-utils.js";

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
    <td id="price-${order.id}" class="order-table">$${order.totalPrice}</td>
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
  const deleteButton = document.querySelector(`#delete-${order.id}`);

  const ticketCategorySelect = document.querySelector(`#select-${order.id}`);
  const numberOfTicketsInput = document.querySelector(`#input-${order.id}`);
  const ticketCategorySpan = document.querySelector(`#ticket-category-${order.id}`);
  const numberOfTicketsSpan = document.querySelector(`#number-tickets-${order.id}`);
  const priceSpan = document.querySelector(`#price-${order.id}`);

  numberOfTicketsInput.addEventListener('change', () => {
    const numberOfTickets = numberOfTicketsInput.value;

    if (numberOfTickets === '' || parseInt(numberOfTickets) <= 0) {
      numberOfTicketsInput.value = 1;
    }
  });

  editButton.addEventListener('click', () => {
    showEditingView();
  });

  confirmButton.addEventListener('click', () => {
    hideEditingView();

    const ticketCategoryId = parseInt(ticketCategorySelect.value);
    const numberOfTickets = parseInt(numberOfTicketsInput.value);

    if (ticketCategoryId === order.ticketCategory.id && numberOfTickets === order.numberOfTickets) {
      return;
    }

    updateOrder(order.id, ticketCategoryId, numberOfTickets)
      .then(updatedOrder => {
        order = updatedOrder;
        ticketCategorySpan.innerHTML = order.ticketCategory.description;
        numberOfTicketsSpan.innerHTML = order.numberOfTickets;
        priceSpan.innerHTML = `$${order.totalPrice}`;

        toastr.success('Order updated!');
      })
      .catch(err => {
        order.event.ticketCategories.forEach((tc, index) => {
          if (tc.id === order.ticketCategory.id) {
            ticketCategorySelect.selectedIndex = index;
          }
        });
        numberOfTicketsInput.value = order.numberOfTickets;

        toastr.error(err.message, 'Error');
        console.log('Error: ' + err.message);
      });
  });

  cancelButton.addEventListener('click', () => {
    hideEditingView();
  });

  deleteButton.addEventListener('click', () => {
    deleteOrder(order.id)
      .then(() => {
        const orderRow = document.querySelector(`#order-${order.id}`);
        orderRow.remove();

        toastr.success('Order deleted!');
      })
      .catch(err => {
        toastr.error(err.message, 'Error');
        console.log('Error: ' + err.message);
      });
  });

  function hideEditingView() {
    editButton.classList.remove('hidden');
    confirmButton.classList.add('hidden');
    cancelButton.classList.add('hidden');

    ticketCategorySelect.classList.add('hidden');
    numberOfTicketsInput.classList.add('hidden');
    ticketCategorySpan.classList.remove('hidden');
    numberOfTicketsSpan.classList.remove('hidden');
  }

  function showEditingView() {
    editButton.classList.add('hidden');
    confirmButton.classList.remove('hidden');
    cancelButton.classList.remove('hidden');

    ticketCategorySelect.classList.remove('hidden');
    numberOfTicketsInput.classList.remove('hidden');
    ticketCategorySpan.classList.add('hidden');
    numberOfTicketsSpan.classList.add('hidden');
  }
}
