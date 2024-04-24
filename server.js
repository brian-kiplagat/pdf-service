const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the public directory
app.use(express.static('public'));

// Define a route for the homepage
app.get('/', (req, res) => {
    res.send('Hello, World! This is the homepage.');
});


// Endpoint to generate PDF
app.get('/generate-pdf', async (req, res) => {
    try {
        // Launch Puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await Promise.all([
            page.goto("https://better-off-blackpeak.webflow.io/pdf-documents/advance-health-care-directive?user_id=140"),

        ]);
        const result = await page.evaluate(() => {
            // Access the Wized object and call its version method
            return Wized.requests.waitFor('Get_Dump_Directives');
        });
        // Listen for console messages
        page.on('console', msg => {
            // Log console messages to the Node.js console
            console.log(`Console ${msg.type()}: ${msg.text()}`);
        });

        // Generate PDF
        const pdfBuffer = await page.pdf({format: 'A2'});

        // Close the browser
        await browser.close();

        // Send the PDF as response
        res.contentType('application/pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
