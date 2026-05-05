async function checkApi() {
  try {
    // 1. Array of payload
    const loginPayload = { email: "admin@m-art.com", password: "admin123" };
    const resAuth = await fetch('http://localhost:5000/api/auth/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginPayload)
    });
    const authData = await resAuth.json();
    if (!authData.token) {
      console.log('Login failed', authData);
      return;
    }

    const { token } = authData;

    // 2. GET unverified artists
    const resArtists = await fetch('http://localhost:5000/api/users/unverified-artists', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const artistsData = await resArtists.json();
    console.log(JSON.stringify(artistsData, null, 2));

  } catch(e) {
    console.error(e);
  }
}
checkApi();
