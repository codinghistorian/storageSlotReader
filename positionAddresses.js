const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path'); // Import the path module

// Initialize the provider
const provider = new ethers.JsonRpcProvider('https://erpc.xinfin.network');

const contractABI = [
    "function positions(uint256) view returns (address)"
];
                    //positionManagerf
const contractAddress = '0x2fE84707e907eaB4C4E6a91CCe458E648be390Ae';

const contract = new ethers.Contract(contractAddress, contractABI, provider);

async function extractAddresses() {
    let addresses = [];

    // Loop from 1 to 150
    for (let i = 1; i <= 150; i++) {
        try {
            let address = await contract.positions(i);
            addresses.push(address);
        } catch (error) {
            console.error(`Error fetching address for index ${i}:`, error.message);
        }
    }

    console.log(addresses);

    // Save to JSON file
    fs.writeFileSync(path.join(__dirname, 'positionAddresses.json'), JSON.stringify(addresses, null, 2));

    return addresses;
}

extractAddresses();
