let products = [];

function init() {
    /*     let product = new Product("Burrito", "Bestes Gericht der Welt", 6.90, 'burrito.jpg', 1);
        console.log("Das Produkt ist: ", product);
    
        let shoppingBasket = new ShoppingBasket();
        shoppingBasket.products.push(product);
        console.log("Mein Warenkorb ist: ", shoppingBasket); */
    createProducts();
    showProducts();
}

function createProducts() {
    products = [
        new Product('Burrito', 'Safiger Burrito mit zarter Hähnchenbrust und mediterranem Gemüse', 6.00, 'burrito.jpg', 1),
        new Product('Taco', 'Knuspriger Taco mit verschiedenem Gemüse der Saison', 6.90, 'taco.jpg', 1),
        new Product('Quesadilla', 'Gebackene Quesadilla gefüllt mit mediterrandem Gemüse und würzigem Käse', 6.90, 'quesadilla.jpg', 1),
        new Product('Tortilla', 'Schmackhafte Tortilla aus Kartoffeln mit Knoblauchöl', 4.70, 'tortilla.jpg', 1),
        new Product('Chili', 'Feurig-scharfes Chili mit Hackfleisch, Bohnen und frischem Koriander', 5.50, 'chili.jpg', 1)
    ]
    console.log("Meine Produkte sind: ", products);
}

function showProducts() {
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
                    <div class="plus"><span>+</span></div>
                    <div class="dish-name">${products[i].name}</div>
                    <div class="dish-desc">${products[i].description}</div>
                    <div class="dish-price">${products[i].price} €</div>
                </div>
            </div>`;
}