#  Installation
1. Make sure to use node 10.20.1
2. Run `npm install` in project root directory
3. Create `.env` file:
```
MNEMONIC_OR_PRIVATE_KEY="{YOUR_PRIVATE_KEY}"
INFURA_API_KEY={YOUR_INFURA_API_KEY}
CONTRACT_NAME={YOUR_CONTRACT_NAME}
CONTRACT_SYMBOL={YOUR_CONTRACT_SYMBOL}
CONTRACT_TOTAL_SUPPLY={YOUR_CONTRACT_TOTAL_SUPPLY}
CONTRACT_DECIMALS={YOUR_CONTRACT_DECIMALS}
```
4. Run `npm run rebuild` in project root directory

#  Boilerplate

This is a starter kit for developing, testing, and deploying smart contracts with a full Typescript environment. This stack uses [Buidler](https://buidler.dev) as the platform layer to orchestrate all the tasks. [Ethers](https://docs.ethers.io/ethers.js/html/index.html) is used for all Ethereum interactions and testing.

[Blog Post](https://medium.com/@rahulsethuram/the-new-solidity-dev-stack-buidler-ethers-waffle-typescript-tutorial-f07917de48ae)