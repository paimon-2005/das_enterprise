async function createAreas() {
    try {
        console.log("Logging in as Admin...");
        const loginRes = await fetch('http://localhost:5000/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'mriabhi2005@gmail.com', password: 'anu@2005' })
        });
        
        const loginData = await loginRes.json();
        const token = loginData.token;

        if (!token) {
            console.error("Login failed. Check if backend is running and credentials are correct.");
            console.error(loginData);
            return;
        }

        console.log("Login successful! Adding areas...");

        const areas = [
            { name: "Mogra", description: "Mogra Region" },
            { name: "Jirat", description: "Jirat Region" },
            { name: "Kuntighat", description: "Kuntighat Region" }
        ];

        for (const area of areas) {
            const res = await fetch('http://localhost:5000/api/v1/areas', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(area)
            });
            
            const data = await res.json();
            if (res.ok) {
                console.log(`✅ Area added successfully: ${area.name}`);
            } else {
                console.log(`⚠️ Problem adding ${area.name}: ${data.message || 'Unknown error'}`);
            }
        }

    } catch (err) {
        console.error("Error running script: ", err);
    }
}

createAreas();
