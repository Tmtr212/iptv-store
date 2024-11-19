const cart = [];

function addToCart(plan, price) {
    cart.push({ plan, price });
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <span>${item.plan} - ${item.price}€</span>
            <button onclick="removeFromCart(${index})">Supprimer</button>
        `;
        cartItems.appendChild(div);
        total += item.price;
    });

    cartTotal.textContent = total + '€';
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

// PayPal Integration
paypal.Buttons({
    createOrder: (data, actions) => {
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        return actions.order.create({
            purchase_units: [{
                amount: { value: total.toFixed(2) }
            }]
        });
    },
    onApprove: (data, actions) => {
        return actions.order.capture().then((details) => {
            alert(`Merci pour votre paiement, ${details.payer.name.given_name}!`);
            cart.length = 0;
            updateCart();
        });
    },
    onError: (err) => {
        console.error(err);
        alert('Erreur lors du paiement.');
    }
}).render('#paypal-button-container');
