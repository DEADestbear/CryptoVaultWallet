export async function fetchCoinPrice() {
    const container = document.getElementById('priceContainer');
    const walletVal = document.getElementById('walletValue');
    const apiKey = 'CG-2UhE78yESRWdrAX3pU6fMsCZ';
    const API_URL = 'https://api.coingecko.com/api/v3/coins/markets';
    
    const walletBalance = 100; 
    const coinType = 'bitcoin'; 

    try {
        const params = new URLSearchParams({
            vs_currency: 'gbp',
            order: 'market_cap_desc', // We get top by market cap, then sort by price
            per_page: '20',
            page: '1',
            sparkline: 'false',
            price_change_percentage: '24h'
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

        // --- SORT BY PRICE (Highest to Lowest) ---
        data.sort((a, b) => b.current_price - a.current_price);

        // Update Wallet Value in Header
        const coin = data.find(c => c.id === coinType);

        if (coin) {
            const walletValue = walletBalance * coin.current_price;
            walletVal.innerHTML = `Wallet Value: £${walletValue.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        }


        // Clear and Rebuild Sidebar
        container.innerHTML = ''; 

        data.forEach(coin => {
            const changeColor = coin.price_change_percentage_24h >= 0 ? 'trend-up' : 'trend-down';
            const symbol = coin.price_change_percentage_24h >= 0 ? '▲' : '▼';

            container.insertAdjacentHTML(
                'beforeend', 
                `<div class="coin-card">
                    <div class="coin-main">
                        <img src="${coin.image}" class="coin-logo" alt="${coin.name}">
                        <div class="coin-info">
                            <span class="coin-name">${coin.name}</span>
                            <span class="coin-price">£${coin.current_price.toLocaleString()}</span>
                        </div>
                    </div>
                    <div class="coin-trend ${changeColor}">
                        ${symbol}${Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                    </div>
                </div>`
            );
        });

    } catch (err) {
        console.error("Error:", err);
        container.innerHTML = "Error loading prices.";
    }
}