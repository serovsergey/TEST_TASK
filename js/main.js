let cart;

const dishes = { //suppose we got this table via fetch/axios
    'dish_01': { 'cat': 1, 'price': 25.00 },
    'dish_02': { 'cat': 1, 'price': 25.00 },
    'dish_03': { 'cat': 1, 'price': 30.00 },
    'dish_04': { 'cat': 1, 'price': 45.00 },
    'dish_05': { 'cat': 1, 'price': 45.00 },
    'dish_06': { 'cat': 2, 'price': 50.00 },
    'dish_07': { 'cat': 2, 'price': 85.00 },
    'dish_08': { 'cat': 2, 'price': 95.00 },
    'dish_09': { 'cat': 2, 'price': 100.00 },
    'dish_10': { 'cat': 3, 'price': 125.00 },
    'dish_11': { 'cat': 3, 'price': 135.00 },
    'dish_12': { 'cat': 3, 'price': 150.00 },
}

function filterDishes() {
    const catElem = document.getElementById('category');
    const cat = catElem && +catElem.value;
    const priceLimitElem = document.getElementById('price_limit');
    const priceLimit = priceLimitElem && +priceLimitElem.value;

    for (const [id, dish] of Object.entries(dishes)) {
        dishElem = document.getElementById(id);
        if (dishElem) {
            dishElem.style.display = (!cat || cat === dish.cat) &&
                (!priceLimit || priceLimit >= dish.price) ?
                'flex' : 'none';
        }
    }
}

function updateTotals() {
    const countElem = document.getElementById('total_count');
    const amountElem = document.getElementById('total_amount');

    countElem.innerText = Object.keys(cart).length;
    amountElem.innerText = Object.keys(cart).reduce((previous, key) => (
        previous + cart[key] * dishes[key].price
    ), 0);

    const btnCheckout = document.getElementById('checkout');
    btnCheckout.style.visibility = Object.keys(cart).length ? 'visible' : 'hidden';
}

function readCart() {
    cartText = localStorage.getItem('cart');
    if (cartText) {
        cart = JSON.parse(cartText);
    } else cart = {};
}

function writeCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(e) {
    const dishId = e.target.parentElement.parentElement.id;
    const qtyInput = e.target.parentElement.getElementsByClassName('qty__item')[0];

    if (dishId && qtyInput && qtyInput.value > 0) {
        const prevQty = cart[dishId];
        cart[dishId] = (prevQty == undefined ? 0 : prevQty) + +qtyInput.value;
        qtyInput.value = '';
        writeCart();
        updateTotals(cart);
    }
}

function closeCheckoutForm() {
    modalWindow = document.getElementById("modal_window");
    if(modalWindow) modalWindow.remove();
}

function proceedCheckout() {
    inputName = document.getElementById("checkout_name");
    if(inputName.value.trim().length === 0) {
       alert('Имя не должно быть пустым!');
       return; 
    }
    inputEmail = document.getElementById("checkout_email");
    if(inputEmail.value.trim().length === 0) {
        alert('E-Mail не должен быть пустым!');
        return; 
    }
    closeCheckoutForm();
    cart = {};
    writeCart();
    updateTotals();
    alert('Благадрим за покупку!');
}

function beginCheckout() {
    var div = document.createElement("div");
    div.id = 'modal_window';
    div.className = 'modal';
    div.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <span> Оформление заказа </span>
                <span class="close" onclick="closeCheckoutForm()">&times;</span>
            </div>
            <div class="checkout-form">
                <form>
                    <p class="caption">Имя:</p> <input id="checkout_name" class="checkout-input" type="text">
                    <p class="caption">E-Mail:</p> <input id="checkout_email" class="checkout-input" type="text">
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn-check" onclick="proceedCheckout()"> Отправить </button>
            </div>
        </div>    
    `;
    document.body.appendChild(div);
}

window.onload = function () {
    const catElem = document.getElementById('category');
    const priceLimitElem = document.getElementById('price_limit');
    const btnCheckout = document.getElementById('checkout');

    catElem.onchange = priceLimitElem.onchange = filterDishes;
    btnCheckout.onclick = beginCheckout;
    [].forEach.call(document.getElementsByClassName('product-box__btn'), function (elem) {
        elem.onclick = addToCart;
    });

    readCart();
    updateTotals();
};