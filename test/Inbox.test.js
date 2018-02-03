const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('Web3'); // It's in uppercase because it's a constructor

const provider = ganache.provider(); // ganache provider
const web3 = new Web3(provider); // Instance of Web3 using the ganache provider

const { interface, bytecode } = require('../compile') //ABI=interface for web3 -Ethereum code= bytecode

let accounts;
let inbox;
const INITIAL_MESSAGE = 'Hi there!'

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts(); // eth - ethereum contracts ==> ganache creates 10 unlocked (it can be used) by default
  
  // Use one of those accounts to deploy
  // the contract
  inbox = await new web3.eth.Contract(JSON.parse(interface)) // Teaches web3 about what methods an Inbox contract has
    .deploy({ data: bytecode, arguments: [INITIAL_MESSAGE]}) // Tells web3 that we want to deploy a copy of this contract: We need to initialize the Inbox contract with some test=initialMessage
    .send({ from: accounts[0], gas: '1000000'}); // Instructs web3 to send out a transactions that creates this contract: We use the first account

    // This code is needed only because of beta release .26 of web3 has a bug
    inbox.setProvider(provider);
});

describe('Inbox', () => {
  it('deploys a contract', () => {
    assert.ok(inbox.options.address); // ok=it has a defined value
  });
  it('has a default message', async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, INITIAL_MESSAGE); 
  });  
  it('can change the message', async () => {
    let newMessage = 'bye';
    await inbox.methods.setMessage(newMessage).send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, newMessage);     
  });   
});
