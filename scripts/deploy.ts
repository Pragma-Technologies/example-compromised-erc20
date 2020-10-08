import { ethers } from '@nomiclabs/buidler';
import { MintableErc20Factory } from '../typechain/MintableErc20Factory';
import { BigNumber } from 'ethers/utils';

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
  const totalSupplyString = process.env.CONTRACT_TOTAL_SUPPLY_IN_WEI;
  if (!totalSupplyString) {
    throw new Error('Unset CONTRACT_TOTAL_SUPPLY');
  }
  const totalSupply = new BigNumber(totalSupplyString);

  const decimalsString = process.env.CONTRACT_DECIMALS;
  if (!decimalsString) {
    throw new Error('Unset CONTRACT_DECIMALS');
  }
  const decimals = Number.parseInt(decimalsString);

  const mintable = await new MintableErc20Factory(account).deploy(name, symbol, totalSupply, decimals);
  console.log('Deployed MintableERC20 contract to:', mintable.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
