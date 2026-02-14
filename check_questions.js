
const fetch = require('node-fetch'); // Assuming node-fetch available or use native fetch if Node 18+

async function check() {
    const examId = 16;
    const baseUrl = 'http://localhost:5173'; // Proxy? Or 8080? 
    // Proxy might not work from node script without cookie.
    // Try raw backend port if known. User didn't specify.
    // Assuming 5173 proxies correctly.

    // Auth might be needed!
    // If Auth is needed, this script will fail 401/403.
    // I can't easily get token from localStorage here.

    console.log("Checking questions for Exam", examId);

    // Just try fetches
    try {
        // 1. Exam endpoint
        const r1 = await fetch(`${baseUrl}/api/exams/${examId}`);
        if (r1.ok) {
            const d1 = await r1.json();
            console.log("Exam Data:", JSON.stringify(d1, null, 2));
        } else {
            console.log("Exam Fetch failed:", r1.status);
        }

        // Check POST endpoint existence
        const r3 = await fetch(`${baseUrl}/api/exams/${examId}/questions`, { method: 'POST' });
        console.log("POST /api/exams/16/questions status:", r3.status);

        // 2. Questions endpoint
        const r2 = await fetch(`${baseUrl}/api/questions?examId=${examId}`);
        if (r2.ok) {
            const d2 = await r2.json();
            console.log("Questions (Filtered):", d2.length);
        } else {
            console.log("Questions Filter failed:", r2.status);
        }

    } catch (e) {
        console.error("Error:", e.message);
    }
}

// Since I cannot run node-fetch easily if not installed...
// I will rely on standard 'http' module if needed, but native fetch is in Node 18.
// I'll assume Node 18.
check();
