async function test() {
  try {
    const res = await fetch('http://localhost:5000/api/chitty-schemes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        schemeCode: 'CF-001',
        schemeName: 'Test Chit Fund',
        collectionAmount: 1000,
        noOfMembers: 50,
        term: 50,
        mode: 'MLY',
        gst: 18,
        adminCharges: 500,
        bidderCommission: 5
      })
    });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Success:", data);
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
