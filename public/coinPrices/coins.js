export async function fetchBitcoinPrice() {
    const container = document.getElementById('price');
    const apiContainer = document.getElementById('api');
    // Use the Demo URL and query parameter for consistency
    const url = `https://api.coingecko.com/api/v3/simple/market_prices&x_cg_demo_api_key=${apiKey}`;

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
                // If using a Demo Key, uncomment the line below:
                'x-cg-demo-api-key': 'CG-2UhE78yESRWdrAX3pU6fMsCZ'
            }
        });
        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();
        apiContainer.innerHTML =  data;
        // data looks like: { "bitcoin": { "usd": 65000 } }
        const bitcoinPrice = data.market_data.current_price.gbp; 
        const ethereumPrice = data.market_data.current_price.gbp;

        // Update the UI inside the try block
        container.innerHTML = `Bitcoin Price: £${bitcoinPrice.toLocaleString()}<br>Ethereum Price: £${ethereumPrice.toLocaleString()}`;
        
        console.log("Success:", data);

    } catch (err) {
        console.error("Error:", err);
        container.innerHTML = "Error loading price.";
    }
}