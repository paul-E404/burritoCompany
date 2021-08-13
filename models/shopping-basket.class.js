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

    /**
     * Adds a chosen product to shopping basket.
     * @param  {number} i Index of the chosen product.
     */
    addToShoppingBasket(i) {
        let product = products[i];
        let searchedProd = this.products.find(prod => prod.name == product.name);
        if (!searchedProd) {
            this.products.push(product);
            this.sBEmpty = false;
            this.updateSB();
        }
        else {
            let index = this.products.indexOf(searchedProd);
            this.raiseQuantity(index);
        }
        saveToLocalStorage(this);
    }

    /**
     * Raises a product's quantity if product already exists in shopping basket.
     * @param  {number} index Index of the searched product in array products in ShoppingBasket object.
     */
    raiseQuantity(index) {
        this.products[index].quantity++;
        this.updateSB();
        saveToLocalStorage(this);
    }

    /**
     * Displays the shopping basket with the current products, prices and information.
     */
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

    /**
     * Toggles information about adding dishes and delivery expenses depending on whether the user has already added an item to shopping basket or not.
     */
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

    /**
     * Generates HTML template for the order in the shopping basket.
     * @param  {number} i Index of the product.
     */
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

    /**
     * Reduces a product's quantity if product already exists in shopping basket.
     * @param  {number} i Index of the product.
     */
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

    /**
     * Deletes a product from shopping basket.
     * @param  {number} i Index of the product.
     */
    deleteFromSB(i) {
        //set quantity back to 1 before deleting to prevent a false quantity if product will be added again
        this.products[i].quantity = 1;
        this.products.splice(i, 1);
        if (this.products.length === 0) {
            this.sBEmpty = true;
            this.total = 0;
        }
        this.updateSB();
        saveToLocalStorage(this);
    }

    /**
     * Calculates subtotal of the order.
     */
    calculateSubtotal() {
        let subtotal = document.getElementById('subtotal');
        for (let i = 0; i < this.products.length; i++) {
            const product = this.products[i];
            this.subtotal += product['quantity'] * product['price'];
        }
        subtotal.innerHTML = this.subtotal.toFixed(2) + '&nbsp;€';
    }

    /**
     * Toggles the discount code entering option as soon as 5.00 € order value is reached or not.
     */
    toggleDiscountInput() {
        let inputDiscountCode = document.getElementById('inputDiscountCode');
        let discountText = document.getElementById('discountText');
        if (this.subtotal >= 5.00) {
            this.allowEnteringCode(inputDiscountCode, discountText);
        }
        else {
            this.forbidEnteringCode(inputDiscountCode, discountText);
        }
    }

    /**
     * Allows the user to enter a discount code.
     * @param  {HTMLElement} inputDiscountCode Input field for the discount code.
     * @param  {HTMLElement} discountText Label to the discount code input field.
     */
    allowEnteringCode(inputDiscountCode, discountText) {
        discountText.classList.remove('grey-text');
        inputDiscountCode.removeAttribute('disabled');
    };

    /**
     * Forbids the user from entering a discount code.
   * @param  {HTMLElement} inputDiscountCode Input field for the discount code.
     * @param  {HTMLElement} discountText Label to the discount code input field.
     */
    forbidEnteringCode(inputDiscountCode, discountText) {
        document.getElementById('discountValue').innerHTML = '0.00&nbsp;€';
        inputDiscountCode.value = '';
        inputDiscountCode.setAttribute('disabled', true);
        discountText.classList.add('grey-text');
        this.total = 0.00;
        document.getElementById('total').innerHTML = '0.00&nbsp;€';
        this.discountAbsoluteCodeEntered = false;
        this.discountPercentagedCodeEntered = false;
    }

    /**
     * Calculates total sum.
     */
    calculateTotal() {
        if (this.sBEmpty === false) {
            this.total = this.subtotal + this.deliveryExpenses;
        }
        else {
            this.total = 0.00;
        }
        if (this.discountAbsoluteCodeEntered) {
            this.subtractDiscountAbsolute();
        }
        if (this.discountPercentagedCodeEntered) {
            this.subtractDiscountPercentaged();
        }
        document.getElementById('total').innerHTML = this.total.toFixed(2) + '&nbsp;€';
    }

    /**
     * Subtracts an absolute discount from total sum.
     */
    subtractDiscountAbsolute() {
        this.total = this.total - this.discountAbsolute;
    }

    /**
     * Subtracts a percentaged discount from total sum.
     */
    subtractDiscountPercentaged() {
        this.total = (this.total) * (1 - this.discountPercentaged);
        let discountValue = document.getElementById('discountValue');
        discountValue.innerHTML = '-&nbsp;' + (this.total * this.discountPercentaged).toFixed(2) + '&nbsp;€';
    }

    /**
     * Displays information and unblocks order button depending on whether minimum order value is reached or not.
     */
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

    /**
     * Returns true if minimum order value is reached.
     * @return {boolan}
     */
    minimumOrderValueReached() {
        return (this.subtotal >= this.minimumOrderValue);
    }

    /**
     * Calculates the difference to minimum order value.
     */
    calculateDiffToMov() {
        return (this.minimumOrderValue - this.subtotal).toFixed(2);
    }

    /**
     * Checks if a free delivery is possible or not depending on subtotal.
     */
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

    /**
     * Returns true if the value for a free delivery is reached.
     * @return {boolan}
     */
    freeDeliveryValueReached() {
        return (this.subtotal >= this.freeDeliveryValue);
    }

    /**
     * Calculates the difference to the value for a free delivery.
     */
    calculateDiffToFreeDelivery() {
        return (this.freeDeliveryValue - this.subtotal).toFixed(2);
    }

    /**
     * Checks if the code is corrrect in order to grant a discount.
     */
    checkCodeForDiscount() {
        let inputDiscountCode = document.getElementById('inputDiscountCode').value;
        let discountValue = document.getElementById('discountValue');
        if (sha256(inputDiscountCode) === this.discountAbsoluteCode) {
            this.grantDiscountAbsolute(discountValue);
        }
        else if (sha256(inputDiscountCode) === this.discountPercentagedCode) {
            this.grantDiscountPercentaged(discountValue);
        }
        else {
            this.resetDiscount(discountValue);
        }
        this.updateSB();
    }

    /**
     * Confirms the right code and displays the absolute discount in the shopping basket user interface.
     */
    grantDiscountAbsolute() {
        this.discountAbsoluteCodeEntered = true;
        discountValue.innerHTML = '-&nbsp;' + this.discountAbsolute.toFixed(2) + '&nbsp;€';
    }

    /**
     * Confirms the right code and displays the percentaged discount in the shopping basket user interface.
     */
    grantDiscountPercentaged() {
        this.discountPercentagedCodeEntered = true;
        discountValue.innerHTML = '-&nbsp;' + (this.total * this.discountPercentaged).toFixed(2) + '&nbsp;€';
    }

    /**
     * Resets discount code user inferface in the shopping basket.
     */
    resetDiscount() {
        this.discountAbsoluteCodeEntered = false;
        this.discountPercentagedCodeEntered = false;
        discountValue.innerHTML = '0.00&nbsp;€'
    }

}