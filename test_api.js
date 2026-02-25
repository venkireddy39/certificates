const http = require('http');

const data = JSON.stringify({
    title: "Test Draft Exam",
    examType: "MIXED",
    totalMarks: 100,
    durationMinutes: 60,
    status: "DRAFT"
});

const options = {
    hostname: '192.168.1.63',
    port: 5151,
    path: '/api/exams',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => console.log(`BODY: ${body}`));
});

req.on('error', (e) => console.error(`problem with request: ${e.message}`));
req.write(data);
req.end();
