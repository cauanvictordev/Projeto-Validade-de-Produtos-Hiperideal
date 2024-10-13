// Carrega os produtos do Local Storage ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    loadProductsFromLocalStorage();
    setInterval(updateProductStatus, 3 * 60 * 60 * 1000); // Atualiza a cada 3 horas
});

// Manipula o envio do formulário
document.getElementById("product-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const productName = document.getElementById("product-name").value;
    const expiryDate = new Date(document.getElementById("expiry-date").value);
    const alertDays = parseInt(document.getElementById("alert-days").value);
    const today = new Date();

    const errorMessage = document.getElementById("error-message");
    errorMessage.textContent = "";

    // Verifica se a data de validade já passou
    if (expiryDate < today) {
        errorMessage.textContent = "A data de validade já está vencida.";
        return; // Sai da função sem adicionar o produto
    }

    addProduct(productName, expiryDate, alertDays);
    saveProductToLocalStorage(productName, expiryDate, alertDays);

    document.getElementById("product-form").reset();
});

// Adiciona um produto à tabela
function addProduct(name, expiryDate, alertDays) {
    const today = new Date();
    const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

    const productRow = document.createElement("tr");

    // Nome do Produto
    const productNameCell = document.createElement("td");
    productNameCell.textContent = name;

    // Data de Validade
    const expiryDateCell = document.createElement("td");
    expiryDateCell.textContent = expiryDate.toLocaleDateString();

    // Dias Restantes
    const daysLeftCell = document.createElement("td");
    daysLeftCell.textContent = daysLeft >= 0 ? daysLeft + " dias" : "Vencido";

    // Notificação
    const notificationCell = document.createElement("td");
    const notificationCircle = document.createElement("div");
    notificationCircle.classList.add("notification");
    
    if (daysLeft <= alertDays && daysLeft >= 0) {
        notificationCircle.classList.add("alert"); // Adiciona o alerta se estiver próximo de vencer
    }

    notificationCell.appendChild(notificationCircle);

    // Botão de excluir
    const actionsCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Excluir";
    deleteButton.classList.add("delete-btn");
    deleteButton.addEventListener("click", function() {
        productRow.remove();
        removeProductFromLocalStorage(name);
    });
    actionsCell.appendChild(deleteButton);

    productRow.appendChild(productNameCell);
    productRow.appendChild(expiryDateCell);
    productRow.appendChild(daysLeftCell);
    productRow.appendChild(notificationCell);
    productRow.appendChild(actionsCell);

    document.getElementById("product-list").appendChild(productRow);
}

// Salva o produto no Local Storage
function saveProductToLocalStorage(name, expiryDate, alertDays) {
    const products = getProductsFromLocalStorage();
    products.push({ name, expiryDate, alertDays });
    localStorage.setItem("products", JSON.stringify(products));
}

// Carrega os produtos do Local Storage
function loadProductsFromLocalStorage() {
    const products = getProductsFromLocalStorage();
    products.forEach(product => {
        addProduct(product.name, new Date(product.expiryDate), product.alertDays);
    });
}

// Atualiza o status dos produtos
function updateProductStatus() {
    document.getElementById("product-list").innerHTML = ""; // Limpa a tabela
    loadProductsFromLocalStorage(); // Recarrega os produtos
}

// Remove o produto do Local Storage
function removeProductFromLocalStorage(name) {
    let products = getProductsFromLocalStorage();
    products = products.filter(product => product.name !== name);
    localStorage.setItem("products", JSON.stringify(products));
}

// Obtém os produtos do Local Storage
function getProductsFromLocalStorage() {
    return localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [];
}

// Manipula o ícone do menu para mostrar ou ocultar o menu de categorias
document.getElementById("menu-icon").addEventListener("click", function() {
    const menu = document.getElementById("menu");
    menu.classList.toggle("show-menu");
});
