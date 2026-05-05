async function checkOrder() {
  try {
    const loginPayload = { email: "kiran@email.com", password: "password123" };
    const resAuth = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginPayload)
    });
    const authData = await resAuth.json();
    if (!authData.token) {
      console.log('Login failed', authData);
      return;
    }

    const resOrder = await fetch('http://localhost:5000/api/orders/create-payment', {
      method: 'POST',
      headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authData.token}`
      },
      // send a dummy item - wait we need a real artwork_id. 
      // i'll just hit the endpoint with empty items to see if razorpay throws or handles.
      // actually empty items throws 400. Let's send a fake id. 
      body: JSON.stringify({ items: [{ artwork_id: "69e0b9bf7ece4265fd21a711" }] })
    });
    const orderData = await resOrder.json();
    console.log(JSON.stringify(orderData, null, 2));

  } catch(e) {
    console.error(e);
  }
}
checkOrder();
