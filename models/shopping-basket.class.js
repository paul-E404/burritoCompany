class ShoppingBasket {

    products = [];
    subtotal = 0;
    deliveryExpenses = 2.00;
    total = 0;
    minimumOrderValue = 10.00;
    freeDeliveryValue = 20.00;

    addToShoppingBasket(i) {
        let product = products[i];
        if (this.notAddedYet(product)) {
            this.products.push(product);
            sBEmpty = false;
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
        this.toggleSBInfo();
        let sBTableOrder = document.getElementById('sB-table-order');
        sBTableOrder.innerHTML = '';
        for (let i = 0; i < this.products.length; i++) {
            sBTableOrder.innerHTML += this.generateHTMLForOrder(i);
        }
        this.subtotal = 0;
        this.total = 0;
        this.calculateSubtotal();
        this.calculateTotal();
        this.checkDifferenceToMov();
        this.checkForFreeDelivery();
    }

    toggleSBInfo() {
        console.log("sBEmpty", sBEmpty);
        let sBInfoAddDishes = document.getElementById('sB-info-add-dishes')
        let deliveryExpensesText = document.getElementById('deliveryExpensesText');
        if (sBEmpty === false) {
            sBInfoAddDishes.setAttribute('hidden', true);
            deliveryExpensesText.removeAttribute('hidden');
        }
        else {
            sBInfoAddDishes.removeAttribute('hidden');
            deliveryExpensesText.setAttribute('hidden', true);
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
                        <td>${(this.products[i].quantity * this.products[i].price).toFixed(2)} €</td>
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
        if (this.products.length === 0) {
            sBEmpty = true;
            this.total = 0;
        }
        this.updateSB();
        //console.log("Die aktuellen Produkte sind: ", this.products);
    }

    calculateSubtotal() {
        let subtotal = document.getElementById('subtotal');
        for (let i = 0; i < this.products.length; i++) {
            const product = this.products[i];
            this.subtotal += product['quantity'] * product['price'];
        }
        //console.log("Zwischensumme: ", this.subtotal, "mit dem Typ", typeof(this.subtotal));
        subtotal.innerHTML = this.subtotal.toFixed(2) + '&nbsp;€';
    }

    calculateTotal() {
        if (sBEmpty === false) {
            this.total = this.subtotal + this.deliveryExpenses;
        }
        else {
            this.total = 0;
        }
        let total = document.getElementById('total');
        total.innerHTML = this.total.toFixed(2) + '&nbsp;€';
        //console.log("Typ von total:", typeof(this.total), "total", this.total);
    }

    checkDifferenceToMov() {
        let diffToMovText = document.getElementById('diffToMovText');
        let diffToMovValue = document.getElementById('diffToMovValue');
        let sBInfoDifferenceToMov = document.getElementById('sBInfoDifferenceToMov');
        let orderBtn = document.getElementById('orderBtn');
        if (this.minimumOrderValueReached()) {
            diffToMovText.setAttribute('hidden', true);
            sBInfoDiffToMov.setAttribute('hidden', true);
            orderBtn.classList.remove('order-btn-disabled');
        }
        else {
            diffToMovText.removeAttribute('hidden');
            let diff = this.calculateDiffToMov();
            diffToMovValue.innerHTML = diff + '&nbsp;€';
            sBInfoDiffToMov.removeAttribute('hidden');
            orderBtn.classList.add('order-btn-disabled');
        }
    }

    minimumOrderValueReached() {
        return (this.subtotal >= this.minimumOrderValue);
    }

    calculateDiffToMov() {
        return (this.minimumOrderValue - this.subtotal).toFixed(2);
    }

    checkForFreeDelivery() {
        let diffToFreeDeliveryText = document.getElementById('diffToFreeDeliveryText');
        let diffToFreeDeliveryValue = document.getElementById('diffToFreeDeliveryValue');
        let deliveryExpensesValue = document.getElementById('deliveryExpensesValue');
        if (this.freeDeliveryValueReached()) {
            diffToFreeDeliveryText.setAttribute('hidden', true);
            this.deliveryExpenses = 0;
        }
        else {
            this.deliveryExpenses = 2;
            let diff = this.calculateDiffToFreeDelivery();
            diffToFreeDeliveryValue.innerHTML = diff + '&nbsp;€';
            diffToFreeDeliveryText.removeAttribute('hidden');
        }
        deliveryExpensesValue.innerHTML = this.deliveryExpenses.toFixed(2) + '&nbsp;€';
    }

    freeDeliveryValueReached() {
        return (this.subtotal >= this.freeDeliveryValue);
    }

    calculateDiffToFreeDelivery() {
        return (this.freeDeliveryValue - this.subtotal).toFixed(2);
    }

}