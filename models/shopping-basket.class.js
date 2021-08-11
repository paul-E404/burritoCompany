class ShoppingBasket {

    products = [];
    subtotal = 0.00;
    deliveryExpenses = 2.00;
    total = 0.00;
    minimumOrderValue = 10.00;
    freeDeliveryValue = 20.00;
    sBEmpty = true;
    discountAbsoluteCode = '3ab25e3f2525db1ba29dc28354d12931365b0d77d43fb954308566e3e96a47e7'; //burrito-5-euro
    discountAbsolute = 5.00;
    discountPercentagedCode = '211070fe9904206a54395e60d3d45dfd5b8c954e3ff9685425445163d3fa9e90'; //burrito-10-prozent
    discountPercentaged = 0.1;
    discountAbsoluteCodeEntered = false;
    discountPercentagedCodeEntered = false;

    addToShoppingBasket(i) {
        let product = products[i];
        if (this.notAddedYet(product)) {
            this.products.push(product);
            this.sBEmpty = false;
            this.updateSB();
        }
        else {
            let index = this.products.indexOf(product);
            console.log("Der Index ist:", index);
            this.raiseQuantity(index);
        }
        saveToLocalStorage(this);
    }

    notAddedYet(product) {
        return !this.products.includes(product);
    }

    raiseQuantity(i) {
        this.products[i].quantity++;
        this.updateSB();
        saveToLocalStorage(this);
    }

    updateSB() {
        this.toggleSBInfo();
        let sBTableOrder = document.getElementById('sB-table-order');
        sBTableOrder.innerHTML = '';
        for (let i = 0; i < this.products.length; i++) {
            sBTableOrder.innerHTML += this.generateHTMLForOrder(i);
        }
        this.subtotal = 0.00;
        this.total = 0.00;
        this.calculateSubtotal();
        this.checkDifferenceToMov();
        this.checkForFreeDelivery();
        this.toggleDiscountInput();
        this.calculateTotal();
    }

    toggleSBInfo() {
        let sBInfoAddDishes = document.getElementById('sB-info-add-dishes')
        let deliveryExpensesText = document.getElementById('deliveryExpensesText');
        if (this.sBEmpty === false) {
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
        saveToLocalStorage(this);
    }

    deleteFromSB(i) {
        this.products[i].quantity = 1;
        this.products.splice(i, 1);
        if (this.products.length === 0) {
            this.sBEmpty = true;
            this.total = 0;
        }
        this.updateSB();
        saveToLocalStorage(this);
    }

    calculateSubtotal() {
        let subtotal = document.getElementById('subtotal');
        for (let i = 0; i < this.products.length; i++) {
            const product = this.products[i];
            this.subtotal += product['quantity'] * product['price'];
        }
        subtotal.innerHTML = this.subtotal.toFixed(2) + '&nbsp;€';
    }

    toggleDiscountInput() {
        let inputDiscountCode = document.getElementById('inputDiscountCode');
        let discountText = document.getElementById('discountText');
        if (this.subtotal >= 5.00) {
            discountText.classList.remove('grey-text');
            inputDiscountCode.removeAttribute('disabled');
        }
        else {
            document.getElementById('discountValue').innerHTML = '0.00&nbsp;€';
            inputDiscountCode.value = '';
            inputDiscountCode.setAttribute('disabled', true);
            discountText.classList.add('grey-text');
            this.total = 0.00;
            document.getElementById('total').innerHTML = '0.00&nbsp;€';
            this.discountAbsoluteCodeEntered = false;
            this.discountPercentagedCodeEntered = false;
        }
    }

    calculateTotal() {
        if (this.sBEmpty === false) {
            this.total = this.subtotal + this.deliveryExpenses;
        }
        else {
            this.total = 0.00;
        }
        if (this.discountAbsoluteCodeEntered) {
            this.total = this.total - this.discountAbsolute;
        }
        if (this.discountPercentagedCodeEntered) {
            this.total = (this.total) * (1 - this.discountPercentaged);
            let discountValue = document.getElementById('discountValue');
            discountValue.innerHTML = '-&nbsp;' + (this.total * this.discountPercentaged).toFixed(2) + '&nbsp;€';

        }
        document.getElementById('total').innerHTML = this.total.toFixed(2) + '&nbsp;€';
    }

    checkDifferenceToMov() {
        let diffToMovText = document.getElementById('diffToMovText');
        let sBInfoDiffToMov = document.getElementById('sBInfoDiffToMov');
        let orderBtn = document.getElementById('orderBtn');
        if (this.minimumOrderValueReached()) {
            diffToMovText.setAttribute('hidden', true);
            sBInfoDiffToMov.setAttribute('hidden', true);
            orderBtn.classList.remove('order-btn-disabled');
            orderBtn.removeAttribute('disabled');
        }
        else {
            diffToMovText.removeAttribute('hidden');
            let diff = this.calculateDiffToMov();
            document.getElementById('diffToMovValue').innerHTML = diff + '&nbsp;€';
            sBInfoDiffToMov.removeAttribute('hidden');
            orderBtn.classList.add('order-btn-disabled');
            orderBtn.setAttribute('disabled', true);
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
        if (this.freeDeliveryValueReached()) {
            diffToFreeDeliveryText.setAttribute('hidden', true);
            this.deliveryExpenses = 0;
        }
        else {
            this.deliveryExpenses = 2;
            let diff = this.calculateDiffToFreeDelivery();
            document.getElementById('diffToFreeDeliveryValue').innerHTML = diff + '&nbsp;€';
            diffToFreeDeliveryText.removeAttribute('hidden');
        }
        document.getElementById('deliveryExpensesValue').innerHTML = this.deliveryExpenses.toFixed(2) + '&nbsp;€';
    }

    freeDeliveryValueReached() {
        return (this.subtotal >= this.freeDeliveryValue);
    }

    calculateDiffToFreeDelivery() {
        return (this.freeDeliveryValue - this.subtotal).toFixed(2);
    }

    checkForDiscount() {
        let inputDiscountCode = document.getElementById('inputDiscountCode').value;
        let discountValue = document.getElementById('discountValue');
        if (sha256(inputDiscountCode) === this.discountAbsoluteCode) {
            console.log("Absoluter Rabatt erreicht!");
            this.discountAbsoluteCodeEntered = true;
            discountValue.innerHTML = '-&nbsp;' + this.discountAbsolute.toFixed(2) + '&nbsp;€';

        }
        else if (sha256(inputDiscountCode) === this.discountPercentagedCode) {
            console.log("Prozentualer Rabatt erreicht!");
            this.discountPercentagedCodeEntered = true;
            discountValue.innerHTML = '-&nbsp;' + (this.total * this.discountPercentaged).toFixed(2) + '&nbsp;€';
        }
        else {
            this.discountAbsoluteCodeEntered = false;
            this.discountPercentagedCodeEntered = false;
            discountValue.innerHTML = '0.00&nbsp;€'
        }
        this.updateSB();
    }

}