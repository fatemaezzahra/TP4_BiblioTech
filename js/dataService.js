async function fetchJSON(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Erreur lors du chargement de " + url);
    }

    return await response.json();
}

export async function loadData() {
    const customers = await fetchJSON("./data/customers.json");
    const products = await fetchJSON("./data/products.json");
    const orders = await fetchJSON("./data/orders.json");

    return {
        customers,
        products,
        orders
    };
}