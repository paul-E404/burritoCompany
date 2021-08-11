let products = [];
let sB;
//let sBEmpty = true;

function init() {
    createShoppingBasket();
    createProducts();
    showMenu();
}

async function createShoppingBasket() {
    sB = await getFromLocalStorage() || new ShoppingBasket();
    sB.updateSB();
}

function createProducts() {
    products = [
        new Product('Burrito', 'Safiger Burrito mit zarter Hähnchenbrust und mediterranem Gemüse', 6.00, 'burrito.jpg', 1),
        new Product('Taco', 'Knuspriger Taco mit verschiedenem Gemüse der Saison', 3.90, 'taco.jpg', 1),
        new Product('Quesadilla', 'Gebackene Quesadilla gefüllt mit mediterrandem Gemüse und würzigem Käse', 7.00, 'quesadilla.jpg', 1),
        new Product('Tortilla', 'Schmackhafte Tortilla aus Kartoffeln mit Knoblauchöl', 4.70, 'tortilla.jpg', 1),
        new Product('Chili', 'Feurig-scharfes Chili mit Hackfleisch, Bohnen und frischem Koriander', 5.50, 'chili.jpg', 1)
    ]
}

function showMenu() {
    let menuContainer = document.getElementById('menu');
    for (let i = 0; i < products.length; i++) {
        menuContainer.innerHTML += generateHTMLForMenu(i);
    }
}

function generateHTMLForMenu(i) {
    return `<div class="dish-box">
                <img src="img/${products[i].imgPath}" alt="${products[i].name}">
                <div class="dish-text">
                    <div onclick="sB.addToShoppingBasket(${i})" class="plus"><span>+</span></div>
                    <div class="dish-name">${products[i].name}</div>
                    <div class="dish-desc">${products[i].description}</div>
                    <div class="dish-price">${products[i].price.toFixed(2)} €</div>
                </div>
            </div>`;
}

function saveToLocalStorage(obj) {
    let json = localStorage.setItem('shoppingBasket', JSON.stringify(obj));
    console.log("Das gesicherte Objekt als String lautet: ", json);
}

function getFromLocalStorage() {
    let object = JSON.parse(localStorage.getItem('shoppingBasket'));
    let sB = Object.assign(new ShoppingBasket, object);
    console.log("Das Objekt aus dem Local Storage lautet: ", sB);
    return sB;
}