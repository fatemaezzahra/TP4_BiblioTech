import { state } from "./state.js";
import { loadData } from "./dataService.js";
import {
    renderIndicators,
    renderCategories,
    renderOrders,
    renderOrderDetails
} from "./view.js";

async function initApp() {
    try {
        const data = await loadData();

        state.customers = data.customers;
        state.products = data.products;
        state.orders = data.orders;

        renderIndicators();
        renderCategories();
        renderOrders();

        document.getElementById("searchInput").addEventListener("input", event => {
            state.searchText = event.target.value.trim();
            renderOrders();
        });

        document.getElementById("statusFilter").addEventListener("change", event => {
            state.statusFilter = event.target.value;
            renderOrders();
        });

        document.getElementById("categoryFilter").addEventListener("change", event => {
            state.categoryFilter = event.target.value;
            renderOrders();
        });

        document.getElementById("ordersContainer").addEventListener("click", event => {
            const button = event.target.closest("[data-order-id]");

            if (button) {
                renderOrderDetails(button.dataset.orderId);
            }
        });

    } catch (error) {
        console.error("Erreur lors de l'initialisation :", error);

        const errorContainer = document.getElementById("errorMessage");

        if (errorContainer) {
            errorContainer.classList.remove("d-none");
            errorContainer.textContent = 
            "Erreur de chargement des données. Vérifiez votre connexion au serveur local et les fichiers JSON.";
        }
    }
}

initApp();