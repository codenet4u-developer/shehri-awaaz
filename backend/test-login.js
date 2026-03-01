fetch('http://127.0.0.1:5173/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@test.com', password: 'test' })
})
    .then(async r => {
        console.log('Status:', r.status);
        const text = await r.text();
        console.log('Body:', text);
    })
    .catch(e => console.error(e));
