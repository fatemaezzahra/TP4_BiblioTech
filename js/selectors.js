import { state } from "./state.js";

export function getCustomer(customerId) {
    return state.customers.find(customer => customer.id === customerId);
}

export function getProduct(productId) {
    return state.products.find(product => product.id === productId);
}

export function getOrderTotal(order) {
    return order.items.reduce((total, item) => {
        const product = getProduct(item.productId);

        if (!product) {
            return total;
        }

        return total + product.price * item.quantity;
    }, 0);
}

export function getFilteredOrders() {
    return state.orders.filter(order => {
        const customer = getCustomer(order.customerId);

        const matchesSearch = customer
            ? customer.name.toLowerCase().includes(state.searchText.toLowerCase())
            : false;

        const matchesStatus =
            state.statusFilter === "Tous" ||
            order.status === state.statusFilter;

        const matchesCategory =
            state.categoryFilter === "Toutes" ||
            order.items.some(item => {
                const product = getProduct(item.productId);

                return product && product.category === state.categoryFilter;
            });

        return matchesSearch && matchesStatus && matchesCategory;
    });
}

export function getTotalOrderValue() {
    return state.orders.reduce((total, order) => {
        return total + getOrderTotal(order);
    }, 0);
}