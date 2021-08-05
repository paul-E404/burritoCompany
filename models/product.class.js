class Product {

    name;
    description;
    price;
    imgPath;
    quantity = 0;

    constructor(name, description, price, imgPath, quantity) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.imgPath = imgPath;
        this.quantity = quantity;
    }

}