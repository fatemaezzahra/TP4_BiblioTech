import { state } from "./state.js";

import {
    getCustomer,
    getProduct,
    getFilteredOrders,
    getOrderTotal,
    getTotalOrderValue
} from "./selectors.js";

// Afficher les indicateurs
export function renderIndicators() {
    document.getElementById("totalCustomers").textContent =
        state.customers.length;

    document.getElementById("totalProducts").textContent =
        state.products.length;

    document.getElementById("totalOrders").textContent =
        state.orders.length;

    const totalValue = getTotalOrderValue();

    document.getElementById("totalValue").textContent =
        totalValue.toLocaleString("fr-MA") + " DH";
}

// Afficher les catégories des livres
export function renderCategories() {
    const categorySelect = document.getElementById("categoryFilter");

    const categories = [
        ...new Set(state.products.map(product => product.category))
    ];

    categorySelect.innerHTML =
        '<option value="Toutes">Toutes les catégories</option>';

    categories.forEach(category => {
        categorySelect.innerHTML +=
            `<option value="${category}">${category}</option>`;
    });
}

// Afficher les commandes
export function renderOrders() {
    const ordersContainer = document.getElementById("ordersContainer");
    const filteredOrders = getFilteredOrders();

    ordersContainer.innerHTML = "";

    if (filteredOrders.length === 0) {
        ordersContainer.innerHTML =
            '<p class="text-muted">Aucune commande trouvée.</p>';
        return;
    }

    filteredOrders.forEach(order => {
        const customer = getCustomer(order.customerId);

        const customerName = customer
            ? customer.name
            : "Client inconnu";

        let statusClass = "";

        if (order.status === "Livree") {
            statusClass = "status-delivered";
        } else if (order.status === "En attente") {
            statusClass = "status-pending";
        } else if (order.status === "Annulee") {
            statusClass = "status-cancelled";
        }

        const orderCard = document.createElement("div");
        orderCard.className = "card order-card mb-3";

        orderCard.innerHTML = `
            <div class="card-body">
                <h3 class="card-title h5">
                    Commande #${order.id}
                </h3>

                <p>
                    <strong>Client :</strong> ${customerName}
                </p>

                <p>
                    <strong>Date :</strong> ${order.date}
                </p>

                <p>
                    <strong>Statut :</strong>
                    <span class="order-status ${statusClass}">
                        ${order.status}
                    </span>
                </p>

                <p>
                    <strong>Montant :</strong>
                    ${getOrderTotal(order).toLocaleString("fr-MA")} DH
                </p>

                <button
                    class="btn btn-primary"
                    data-order-id="${order.id}"
                >
                    Voir les détails
                </button>
            </div>
        `;

        ordersContainer.appendChild(orderCard);
    });
}

// Afficher les détails d'une commande
export function renderOrderDetails(orderId) {
    const order = state.orders.find(
        item => item.id === Number(orderId)
    );

    const detailsContainer = document.getElementById("orderDetails");

    if (!order) {
        detailsContainer.innerHTML =
            '<p class="text-muted">Commande introuvable.</p>';
        return;
    }

    const customer = getCustomer(order.customerId);

    let productsHTML = "";

    order.items.forEach(item => {
        const product = getProduct(item.productId);

        if (product) {
            const lineTotal = product.price * item.quantity;

            productsHTML += `
                <tr>
                    <td>
                        ${product.name}
                        <br>
                        <span class="book-category">
                            ${product.category}
                        </span>
                    </td>

                    <td>${product.price} DH</td>

                    <td>${item.quantity}</td>

                    <td>${lineTotal.toLocaleString("fr-MA")} DH</td>
                </tr>
            `;
        }
    });

    detailsContainer.innerHTML = `
        <h3 class="section-title h5">
            Commande #${order.id}
        </h3>

        <p>
            <strong>Client :</strong>
            ${customer ? customer.name : "Client inconnu"}
        </p>

        <p>
            <strong>Ville :</strong>
            ${customer ? customer.city : "Inconnue"}
        </p>

        <p>
            <strong>Date :</strong> ${order.date}
        </p>

        <p>
            <strong>Statut :</strong> ${order.status}
        </p>

        <div class="table-responsive">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Livre</th>
                        <th>Prix unitaire</th>
                        <th>Quantité</th>
                        <th>Total</th>
                    </tr>
                </thead>

                <tbody>
                    ${productsHTML}
                </tbody>
            </table>
        </div>

        <h4 class="section-title h5">
            Total de la commande :
            ${getOrderTotal(order).toLocaleString("fr-MA")} DH
        </h4>
    `;
}