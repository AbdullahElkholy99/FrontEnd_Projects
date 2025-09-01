let total = 0;
let count = 0;

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        const card = e.target.closest('.card');
        const title = card.querySelector('.tit')?.textContent || 'Product';
        const price = parseFloat(card.querySelector('.price')?.textContent.replace('$', '') || 0);

        const cartItems = document.querySelector('.cart-items');
        const li = document.createElement('li');
        li.textContent = `${title} - $${price}`;
        cartItems.appendChild(li);

        total += price;
        count += 1;

        document.getElementById('cart-total').textContent = total.toFixed(2);
       
        // Only show cart count if .cart-count exists
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = count;
        }
    });
});

//************************************* */

//************************************* */

