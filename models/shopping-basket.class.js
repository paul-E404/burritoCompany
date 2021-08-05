class ShoppingBasket {

    products = [];
    subtotal;
    deliveryExpenses = 2.00;
    total;

    addToShoppingBasket(i) {
        let product = products[i];
        if (this.notAddedYet(product)) {
            this.products.push(product);
            this.updateSB();
        }
        else {
            let index = this.products.indexOf(product);
            console.log("Der Index ist:", index);
            this.raiseQuantity(index);
        }
    }

    notAddedYet(product) {
        return !this.products.includes(product);
    }
    
    raiseQuantity(i) {
        this.products[i].quantity++;
        this.updateSB();
    }

    updateSB() {
        let sBTableOrder = document.getElementById('sB-table-order');
        sBTableOrder.innerHTML = '';
        for (let i = 0; i < this.products.length; i++) {
            sBTableOrder.innerHTML += this.generateHTMLForOrder(i);
        }
    }

    generateHTMLForOrder(i) {
        return `<tbody>
                    <tr>
                        <td>${this.products[i].quantity}x</td>
                        <td>${this.products[i].name}</td>
                        <td>
                            <div onclick="sB.reduceQuantity(${i})" class="sB-quantity-icons sB-minus"><span>-</span></div>
                        </td>
                        <td>
                            <div onclick="sB.raiseQuantity(${i})" class="sB-quantity-icons sB-plus"><span>+</span></div>
                        </td>
                        <td>${this.products[i].price.toFixed(2)} €</td>
                        <td><i onclick="sB.deleteFromSB(${i})" class="trash-icon far fa-trash-alt"></i></td>
                    </tr>
                </tbody>`;
    }

    reduceQuantity(i) {
        if (this.products[i].quantity > 1) {
            this.products[i].quantity--;
            this.updateSB();
        }
        else {
            this.deleteFromSB(i);
        }
    }
    
    deleteFromSB(i) {
        this.products[i].quantity = 1;
        this.products.splice(i, 1);
        this.updateSB();
        console.log("Die aktuellen Produkte sind: ", this.products);
    }
    
}