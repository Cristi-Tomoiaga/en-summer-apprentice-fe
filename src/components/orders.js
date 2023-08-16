import {fetchOrders} from "../utils/network-utils.js";
import {createOrderRow, setupOrderRowListeners} from "./order-row.js";
import {createOrderHeader, setupOrderHeaderListeners} from "./order-header.js";
import {addLoader, removeLoader} from "./loader.js";

export const createOrdersComponent = () => {
  const contentDiv = document.querySelector("#orders-content");
  contentDiv.innerHTML = 'No orders';

  addLoader();
  fetchOrders()
    .then(orders => {
      if (orders.length) {
        contentDiv.innerHTML = '';
        contentDiv.appendChild(createOrderHeader());
        setupOrderHeaderListeners(orders, (sortedOrders) => {
          if (sortedOrders.length) {
            contentDiv.innerHTML = '';
            createOrdersRows(contentDiv, sortedOrders);
          } else {
            contentDiv.innerHTML = 'No orders';
          }
        });

        createOrdersRows(contentDiv, orders);
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
    setupOrderRowListeners(o);
  });
}
