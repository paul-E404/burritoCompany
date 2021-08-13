let products = [];
let sB;
let sBMobileOpened = false;

/**
 * Starts the main functions for displaying the website properly.
 */
function init() {
    addEventListener('resize', function (event) {
        if (this.window.innerWidth >= 900) {
            showSBRight();
        }
    }, true)
    createShoppingBasket();
    createProducts();
    showMenu();
}

/**
 * Creates the shopping basket.
 */
async function createShoppingBasket() {
    sB = await getFromLocalStorage() || new ShoppingBasket();
    sB.updateSB();
}

/**
 * Creates all products on the menu.
 */
function createProducts() {
    products = [
        new Product('Burrito', 'Safiger Burrito mit zarter Hähnchenbrust und mediterranem Gemüse', 6.00, 'burrito.jpg', 1),
        new Product('Taco', 'Knuspriger Taco mit verschiedenem Gemüse der Saison', 3.90, 'taco.jpg', 1),
        new Product('Quesadilla', 'Gebackene Quesadilla gefüllt mit mediterrandem Gemüse und würzigem Käse', 7.00, 'quesadilla.jpg', 1),
        new Product('Tortilla', 'Schmackhafte Tortilla aus Kartoffeln mit Knoblauchöl', 4.70, 'tortilla.jpg', 1),
        new Product('Chili', 'Feurig-scharfes Chili mit Hackfleisch, Bohnen und frischem Koriander', 5.50, 'chili.jpg', 1)
    ]
}

/**
 * Iterates through the procuts array and displays all products on the menu container.
 */
function showMenu() {
    let menuContainer = document.getElementById('menu');
    for (let i = 0; i < products.length; i++) {
        menuContainer.innerHTML += generateHTMLForMenu(i);
    }
}

/**
 * Generates the HTML template for the menu.
 * @param  {number} i - Index of products array.
 */
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

/**
 * Saves object to local storage.
 * @param  {obj} obj - The ShoppingBasket object.
 */
function saveToLocalStorage(obj) {
    localStorage.setItem('shoppingBasket', JSON.stringify(obj));
}

/**
 * Gets ShoppingBasket object from local storage.
 */
function getFromLocalStorage() {
    let object = JSON.parse(localStorage.getItem('shoppingBasket'));
    let sB = Object.assign(new ShoppingBasket, object);
    console.log("Das Objekt aus dem Local Storage lautet: ", sB);
    return sB;
}

/**
 * Guaratees that shopping basket is always visible on the right on devices with a minimum width of 900px.
 */
function showSBRight() {
    document.getElementById('sBContainer').style.display = 'flex';
    document.getElementById('closeX').visibility = 'hidden';
    document.getElementById('sBMobileBtnContainer').style.display = 'none';
}

/**
 * Toggles mobile display of shopping basket.
 */
function toggleSB() {
    let sBContainer = document.getElementById('sBContainer');
    let sBMobileBtnContainer = document.getElementById('sBMobileBtnContainer');
    if (sBMobileOpened === false) {
        sBContainer.style.display = 'flex';
        sBMobileBtnContainer.style.display = 'none';
        sBMobileOpened = true;
    }
    else {
        sBContainer.style.display = 'none';
        sBMobileBtnContainer.style.display = 'flex';
        sBMobileOpened = false;
    }
}