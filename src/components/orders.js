import {fetchOrders} from "../utils/network-utils.js";
import {createOrderRow, setupOrderRowListeners} from "./order-row.js";
import {createOrderHeader, setupOrderHeaderListeners} from "./order-header.js";
import {addLoader, removeLoader} from "./loader.js";

export const createOrdersComponent = () => {
  const ordersTableHeader = document.querySelector("#orders-content thead");
  const ordersTableBody = document.querySelector("#orders-content tbody");
  ordersTableBody.innerHTML = 'No orders';

  addLoader();
  fetchOrders()
    .then(orders => {
      if (orders.length) {
        ordersTableHeader.innerHTML = '';
        ordersTableHeader.appendChild(createOrderHeader());
        ordersTableBody.innerHTML = '';

        setupOrderHeaderListeners(orders, (sortedOrders) => {
          if (sortedOrders.length) {
            ordersTableBody.innerHTML = '';
            createOrdersRows(ordersTableBody, sortedOrders);
          } else {
            ordersTableBody.innerHTML = 'No orders';
          }
        });

        createOrdersRows(ordersTableBody, orders);
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

const createOrdersRows = (ordersContainer, orders) => {
  orders.forEach(o => {
    const orderRow = createOrderRow(o);
    ordersContainer.appendChild(orderRow);
    setupOrderRowListeners(orders, o);
  });
}
