let products = [];
let sB;

function init() {
    /*     let product = new Product("Burrito", "Bestes Gericht der Welt", 6.90, 'burrito.jpg', 1);
        console.log("Das Produkt ist: ", product);
    
        let sB = new ShoppingBasket();
        sB.products.push(product);
        console.log("Mein Warenkorb ist: ", shoppingBasket); */
    createShoppingBasket();
    createProducts();
    showMenu();
}

function createShoppingBasket() {
    sB = new ShoppingBasket();
}

function createProducts() {
    products = [
        new Product('Burrito', 'Safiger Burrito mit zarter Hähnchenbrust und mediterranem Gemüse', 6.00, 'burrito.jpg', 1),
        new Product('Taco', 'Knuspriger Taco mit verschiedenem Gemüse der Saison', 6.90, 'taco.jpg', 1),
        new Product('Quesadilla', 'Gebackene Quesadilla gefüllt mit mediterrandem Gemüse und würzigem Käse', 6.90, 'quesadilla.jpg', 1),
        new Product('Tortilla', 'Schmackhafte Tortilla aus Kartoffeln mit Knoblauchöl', 4.70, 'tortilla.jpg', 1),
        new Product('Chili', 'Feurig-scharfes Chili mit Hackfleisch, Bohnen und frischem Koriander', 5.50, 'chili.jpg', 1)
    ]
}

function showMenu() {
    let menuContainer = document.getElementById('menu');
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        menuContainer.innerHTML += generateHTMLForMenu(i);
    }
}

function generateHTMLForMenu(i) {
    return `<div class="dish-box">
                <img src="img/${products[i].imgPath}" alt="${products[i].name}">
                <div class="dish-text">
                    <div onclick="addToShoppingBasket(${i})" class="plus"><span>+</span></div>
                    <div class="dish-name">${products[i].name}</div>
                    <div class="dish-desc">${products[i].description}</div>
                    <div class="dish-price">${products[i].price.toFixed(2)} €</div>
                </div>
            </div>`;
}

function addToShoppingBasket(i) {
    let product = products[i];
    if (notAddedYet(product)) {
        sB.products.push(product);
        updateSB();
    }
    else {
        let index = sB.products.indexOf(product);
        console.log("Der Index ist:", index);
        raiseQuantity(index);
    }
    console.log("Mein Warenkorb enthält: ", sB);
}

function notAddedYet(product) {
    return !sB.products.includes(product);
}

function raiseQuantity(i) {
    sB.products[i].quantity++;
    updateSB();
}

function updateSB() {
    let sBTableOrder = document.getElementById('sB-table-order');
    sBTableOrder.innerHTML = '';
    for (let i = 0; i < sB.products.length; i++) {
        sBTableOrder.innerHTML += generateHTMLForOrder(i);
    }
}

function generateHTMLForOrder(i) {
    return `<tbody>
                <tr>
                    <td>${sB.products[i].quantity}x</td>
                    <td>${sB.products[i].name}</td>
                    <td>
                        <div onclick="reduceQuantity(${i})" class="sB-quantity-icons sB-minus"><span>-</span></div>
                    </td>
                    <td>
                        <div onclick="raiseQuantity(${i})" class="sB-quantity-icons sB-plus"><span>+</span></div>
                    </td>
                    <td>${sB.products[i].price.toFixed(2)} €</td>
                    <td><i class="trash-icon far fa-trash-alt"></i></td>
                </tr>
            </tbody>`;
}

function reduceQuantity(i) {
    if (sB.products[i].quantity > 1) {
        sB.products[i].quantity--;
        updateSB();
    }
    else {
        deleteFromSB(i);
    }
}

function deleteFromSB(i) {
    sB.products.splice(i, 1);
    console.log("Produkte im Shopping Basket:", sB.products);
    updateSB();
}