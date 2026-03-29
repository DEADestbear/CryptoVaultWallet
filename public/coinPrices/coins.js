export async function fetchCoinPrice() {
    const container = document.getElementById('priceContainer');
    const apiContainer = document.getElementById('api');
    const apiKey = 'CG-2UhE78yESRWdrAX3pU6fMsCZ';
    const API_URL = 'https://api.coingecko.com/api/v3/coins/markets';
    const walletVal = document.getElementById('walletValue');
    const waletbalence = 100; // Example wallet balance in GBP
    const coinType = 'bitcoin'; // Example coin type

    try {
        const params = new URLSearchParams({
            vs_currency: 'gbp',
            order: 'market_cap_desc',
            per_page: '10',
            page: '1',
            sparkline: 'false'
        });

        const response = await fetch(`${API_URL}?${params}`, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'x-cg-demo-api-key': apiKey
            }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        // raw JSON in the apiContainer (useful for debugging)
        apiContainer.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        
        // Calculate the value of the wallet based on the current price of the specified coin
        const coin = data.find(c => c.id === coinType);
        if (coin) {
            const walletValue = waletbalence * coin.current_price;
            walletVal.innerHTML = `Wallet Value: £${walletValue.toLocaleString()}`;
        }
        


        // output the name and current price of each coin in the container
        container.innerHTML = ''; // clear previous content

        data.forEach(coin => {
            container.insertAdjacentHTML(
                'beforeend', 
                `<div id= coins><strong>${coin.name}:</strong> £${coin.current_price.toLocaleString()}</div>`
            );
        })
        
        
        console.log("Success:", data);

    } catch (err) {
        console.error("Error:", err);
        container.innerHTML = "Error loading price.";
    }
}