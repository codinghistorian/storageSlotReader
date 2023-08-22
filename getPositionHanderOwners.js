const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

const provider = new ethers.JsonRpcProvider('https://erpc.xinfin.network');

const contractABI = [
    "function owners(uint256) view returns (address)"
];

const contractABI2 = [
    "function positions(uint256) view returns (address)"
];

const contractABI3 = [
    "function owner() view returns (address)"
];

const contractAddress = '0x2fE84707e907eaB4C4E6a91CCe458E648be390Ae';

const contract = new ethers.Contract(contractAddress, contractABI, provider);
const contract2 = new ethers.Contract(contractAddress, contractABI2, provider);

async function extractAddresses() {
    let output = {};

    for (let i = 1; i <= 150; i++) {
        try {
            let proxyWallet = await contract.owners(i);
            let positionHandler = await contract2.positions(i);
            const contract3 = new ethers.Contract(proxyWallet, contractABI3, provider);
            let EOA = await contract3.owner();

            output[i] = {
                proxyWallets: proxyWallet,
                positionHandlers: positionHandler,
                EOAs: EOA
            };

        } catch (error) {
            console.error(`Error fetching address for index ${i}:`, error.message);
        }
    }

    fs.writeFileSync(path.join(__dirname, 'positionNumAndProxyWallets.json'), JSON.stringify(output, null, 2));

    return output;
}

extractAddresses();
