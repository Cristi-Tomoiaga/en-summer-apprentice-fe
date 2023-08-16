import {useStyle} from "./styles.js";

export const createOrderHeader = () => {
  const orderHeader = document.createElement('tr');
  orderHeader.classList.add(...useStyle("orderHeader"));

  const tableHeaderContent = `
    <th class="order-table">
      <button id="sort-name-button">
        Event Name
        <i class="fa-solid fa-arrow-up-wide-short" id="sort-name-icon"></i> <!-- fa-arrow-down-wide-short -->
      </button>
    </th>
    <th class="order-table">Date</th>
    <th class="order-table">Ticket Category</th>
    <th class="order-table">Number of Tickets</th>
    <th class="order-table">
      <button id="sort-price-button">
        Total Price
        <i class="fa-solid fa-arrow-up-wide-short" id="sort-price-icon"></i> <!-- fa-arrow-down-wide-short -->
      </button>
    </th>
    <th class="order-table w-32">Actions</th>
  `;

  orderHeader.innerHTML = tableHeaderContent;
  return orderHeader;
}

export const setupOrderHeaderListeners = (orders, updateCallback) => {
  const sortNameButton = document.querySelector('#sort-name-button');
  const sortPriceButton = document.querySelector('#sort-price-button');
  const sortNameIcon = document.querySelector('#sort-name-icon');
  const sortPriceIcon = document.querySelector('#sort-price-icon');

  const arrowUpClass = 'fa-arrow-up-wide-short';
  const arrowDownClass = 'fa-arrow-down-wide-short';

  sortNameButton.addEventListener('click', () => {
    sortNameIcon.classList.toggle(arrowUpClass);
    sortNameIcon.classList.toggle(arrowDownClass);

    if (sortNameIcon.classList.contains(arrowUpClass)) {
      const sortedOrders = orders.sort((first, second) => {
        const firstName = first.event.name.toLowerCase();
        const secondName = second.event.name.toLowerCase();

        if (firstName < secondName) {
          return -1;
        }
        if (firstName > secondName) {
          return 1;
        }
        return 0;
      });

      updateCallback(sortedOrders);
    } else {
      const sortedOrders = orders.sort((first, second) => {
        const firstName = first.event.name.toLowerCase();
        const secondName = second.event.name.toLowerCase();

        if (firstName > secondName) {
          return -1;
        }
        if (firstName < secondName) {
          return 1;
        }
        return 0;
      });

      updateCallback(sortedOrders);
    }
  });

  sortPriceButton.addEventListener('click', () => {
    sortPriceIcon.classList.toggle(arrowUpClass);
    sortPriceIcon.classList.toggle(arrowDownClass);

    if (sortPriceIcon.classList.contains(arrowUpClass)) {
      const sortedOrders = orders.sort((first, second) => first.totalPrice - second.totalPrice);

      updateCallback(sortedOrders);
    } else {
      const sortedOrders = orders.sort((first, second) => second.totalPrice - first.totalPrice);

      updateCallback(sortedOrders);
    }
  });
}
