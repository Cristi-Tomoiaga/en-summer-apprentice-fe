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
        setupOrderHeaderListeners();

        orders.forEach(o => {
          const orderRow = createOrderRow(o);
          contentDiv.appendChild(orderRow);
          setupOrderRowListeners(o);
        });

        setTimeout(removeLoader, 250);
      }
    })
    .catch(err => {
      toastr.error(err.message, 'Error');
      console.log('Error: ' + err.message);
    });
}
