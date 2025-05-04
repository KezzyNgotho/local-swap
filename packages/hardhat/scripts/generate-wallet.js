const crypto = require('crypto');
const secp256k1 = require('secp256k1');
const keccak256 = require('keccak256');

function generateWallet() {
    let privateKey;
    do {
        privateKey = crypto.randomBytes(32);
    } while (!secp256k1.privateKeyVerify(privateKey));

    const publicKey = Buffer.from(secp256k1.publicKeyCreate(privateKey, false));
    const address = keccak256(publicKey.slice(1)).slice(-20);

    console.log('\nNew Wallet Generated!');
    console.log('Address: 0x' + address.toString('hex'));
    console.log('Private Key: 0x' + privateKey.toString('hex'));
    console.log('\nIMPORTANT: Save these details securely and NEVER share your private key!');
    console.log('\nNext steps:');
    console.log('1. Copy your private key (without the 0x prefix)');
    console.log('2. Get testnet CELO from https://faucet.celo.org/alfajores');
    console.log('3. Set your private key in the environment with:');
    console.log('   $env:PRIVATE_KEY="your-private-key-here"');
}

generateWallet(); 