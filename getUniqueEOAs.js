const fs = require('fs');

// Read the JSON file
fs.readFile('positionNumAndProxyWallets.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    // Parse the JSON data
    const jsonData = JSON.parse(data);

    // Extract unique EOAs
    const uniqueEOAs = new Set();
    for (const key in jsonData) {
        uniqueEOAs.add(jsonData[key].EOAs);
    }

    // Convert the Set to an object with the desired format
    const formattedEOAs = {};
    let index = 1;
    for (const key in jsonData) {
        if (uniqueEOAs.has(jsonData[key].EOAs)) {
            formattedEOAs[index] = {
                "proxyWallets": jsonData[key].proxyWallets,
                "EOAs": jsonData[key].EOAs
            };
            // Remove the EOA from the set to ensure uniqueness
            uniqueEOAs.delete(jsonData[key].EOAs);
            index++;
        }
    }

    // Write the formatted EOAs to another JSON file
    fs.writeFile('formattedEOAs.json', JSON.stringify(formattedEOAs, null, 2), (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('Formatted EOAs have been written to formattedEOAs.json');
        }
    });
});
