const { ethers } = require('ethers');

const fs = require('fs');

// Initialize the provider (you can use other providers like Infura, Alchemy, etc.)
const provider = new ethers.JsonRpcProvider('https://earpc.xinfin.network');

async function getStorageAt(contractAddress, slot) {
    return await provider.getStorage(contractAddress, slot);
}

async function getAllStorageSlots(contractAddress) {
    const storageData = {};

    for (let i = 0; i <= 168; i++) {
        const slot = BigInt(i);
        storageData[slot] = await getStorageAt(contractAddress, slot);
    }

    return storageData;
}

function saveToCSV(contractName, contractAddress, data, filename) {
    const header = "Contract Name,Contract Address,Slot,Value\n";
    const csvContent = Object.entries(data).map(([slot, value]) => `${contractName},${contractAddress},${slot},${value}`).join('\n');

    fs.writeFileSync(filename, header + csvContent);
}

// Load contract addresses from JSON file
const contracts = require('./addresses.json');

// Loop through each contract and save data to CSV
for (const [contractName, contractAddress] of Object.entries(contracts)) {
    getAllStorageSlots(contractAddress).then(data => {
        const filename = `${contractName}_storageData.csv`;
        saveToCSV(contractName, contractAddress, data, filename);
        console.log(`Data for ${contractName} saved to ${filename}`);
    }).catch(error => {
        console.error(`Error fetching storage slots for ${contractName}:`, error);
    });
}
