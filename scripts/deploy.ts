import { ethers } from '@nomiclabs/buidler';
import { MintableErc20Factory } from '../typechain/MintableErc20Factory';

async function main() {
  const account = (await ethers.getSigners())[0];
  const name = process.env.CONTRACT_NAME;
  if (!name) {
    throw new Error('Unset CONTRACT_NAME');
  }
  const symbol = process.env.CONTRACT_SYMBOL;
  if (!symbol) {
    throw new Error('Unset CONTRACT_SYMBOL');
  }
  const totalSupply = process.env.CONTRACT_TOTAL_SUPPLY;
  if (!totalSupply) {
    throw new Error('Unset CONTRACT_TOTAL_SUPPLY');
  }
  const decimals = process.env.CONTRACT_DECIMALS;
  if (!decimals) {
    throw new Error('Unset CONTRACT_DECIMALS');
  }
  const contract = await new MintableErc20Factory(account).deploy(name, symbol, totalSupply, decimals);
  console.log('Deployed contract to:', contract.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
