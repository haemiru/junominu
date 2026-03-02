// Wait for the DOM to load before initializing logic
document.addEventListener("DOMContentLoaded", () => {
    // Render the PayPal button into #paypal-button-container
    // The PayPal SDK automatically creates the UI elements.
    if (window.paypal) {
        paypal.Buttons({
            // 1. Set up the transaction
            createOrder: function (data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        description: 'JunoMinu VIP Game Pass',
                        amount: {
                            value: '10.00' // Transaction amount
                        }
                    }]
                });
            },

            // 2. Finalize the transaction
            onApprove: function (data, actions) {
                return actions.order.capture().then(function (orderData) {
                    // Successful capture! 
                    console.log('Capture result', orderData);

                    // You might want to get the specific capture ID:
                    const transaction = orderData.purchase_units[0].payments.captures[0];

                    // Replace the PayPal button with a success message
                    const container = document.querySelector('.checkout-container');
                    container.innerHTML = `
                        <div class="success-message">
                            <h3>Payment Successful!</h3>
                            <p>Thank you for buying the VIP Pass, <strong>${orderData.payer.name.given_name}</strong>.</p>
                            <p class="transaction-id">Transaction ID: ${transaction.id}</p>
                            <button class="nav-btn premium-action-btn" onclick="window.location.href='index.html'">Return to Games</button>
                        </div>
                    `;
                });
            },

            // 3. Handle cancel logic
            onCancel: function (data) {
                console.log("Payment canceled by user", data);
                // Optionally show a message to the user that it was canceled
            },

            // 4. Handle errors during the payment process
            onError: function (err) {
                console.error("Payment error", err);
                alert('A payment error occurred. Please try again.');
            }
        }).render('#paypal-button-container');
    } else {
        console.error("PayPal SDK could not be loaded.");
    }
});
