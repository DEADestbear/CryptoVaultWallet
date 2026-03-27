export async function fetchBitcoinPrice() {
    const apiKey = "CG-2UhE78yESRWdrAX3pU6fMsCZ";
    const container = document.getElementById('price');
    
    // Use the Demo URL and query parameter for consistency
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&x_cg_demo_api_key=${apiKey}`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        
        // data looks like: { "bitcoin": { "usd": 65000 } }
        const price = data.bitcoin.usd;
        
        // Update the UI inside the try block
        container.innerHTML = `Bitcoin Price: $${price.toLocaleString()}`;
        console.log("Success:", data);

    } catch (err) {
        console.error("Error:", err);
        container.innerHTML = "Error loading price.";
    }
}

