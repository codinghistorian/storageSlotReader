const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Initialize the provider
const provider = new ethers.JsonRpcProvider('https://erpc.xinfin.network');

const fxdTokenAddress = '0x49d3f7543335cf38Fa10889CCFF10207e22110B5';
const fxdTokenABI = [
    "function balanceOf(address account) view returns (uint256)"
];
const fxdTokenContract = new ethers.Contract(fxdTokenAddress, fxdTokenABI, provider);

async function checkBalances() {
    // Read the formattedEOAs.json file
    const data = fs.readFileSync(path.join(__dirname, 'formattedEOAs.json'), 'utf8');
    const jsonData = JSON.parse(data);

    for (let key in jsonData) {
        const eoa = jsonData[key].EOAs;
        try {
            const balance = await fxdTokenContract.balanceOf(eoa);
            if (balance == 0) {
                delete jsonData[key]; // Remove the entry if the balance is 0
            } else {
                jsonData[key].FXDBalance = balance.toString();
            }
        } catch (error) {
            console.error(`Error fetching balance for address ${eoa}:`, error.message);
        }
    }

    // Save to JSON file
    fs.writeFileSync(path.join(__dirname, 'FXDHolderEOAs.json'), JSON.stringify(jsonData, (key, value) => {
        if (typeof value === 'bigint') {
            return value.toString();
        }
        return value;
    }, 2));

    console.log(jsonData);
    return jsonData;
}

checkBalances();
