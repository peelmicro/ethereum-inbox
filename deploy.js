const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('Web3'); 
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
    'mom cause weekend slight twin toy swap shadow core rule payment later', // Obtained from MetaMask when a new user account is created
    'https://rinkeby.infura.io/Pq2fD7W38PK3alrIp3aU' // Copy from the email sent by Infura
);

const web3 = new Web3(provider);

let accounts;
let inbox;
const INITIAL_MESSAGE = 'Hi there!'

const deploy = async () => { // We need to create a function to use async
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts(); // eth - ethereum contracts 

  console.log('Attempting to deploy from account',accounts[0]);
  
  // Use one of those accounts to deploy
  // the contract
  inbox = await new web3.eth.Contract(JSON.parse(interface)) // Teaches web3 about what methods an Inbox contract has
    .deploy({ data: bytecode, arguments: [INITIAL_MESSAGE]}) // Tells web3 that we want to deploy a copy of this contract: We need to initialize the Inbox contract with some test=initialMessage
    .send({ from: accounts[0], gas: '1000000'}); // Instructs web3 to send out a transactions that creates this contract: We use the first account

/*     // This code is needed only because of beta release .26 of web3 has a bug
    inbox.setProvider(provider); */

    console.log('Contract deployed to', inbox.options.address);
};
deploy();