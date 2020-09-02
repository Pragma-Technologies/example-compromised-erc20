import { Wallet } from 'ethers';
import { Web3Provider } from 'ethers/providers';
import { MintableErc20 } from '../../typechain/MintableErc20';
import { MintableErc20Factory } from '../../typechain/MintableErc20Factory';

export interface MintableFixture {
  mintable: MintableErc20;
}

const overrides = {
  gasLimit: 9999999,
  gasPrice: 1,
};

export async function mintableFixture(provider: Web3Provider, [wallet]: Wallet[]): Promise<MintableFixture> {
  const CONTRACT_DECIMALS = process.env.CONTRACT_DECIMALS as string;
  const CONTRACT_NAME = process.env.CONTRACT_NAME as string;
  const CONTRACT_SYMBOL = process.env.CONTRACT_SYMBOL as string;
  const CONTRACT_TOTAL_SUPPLY = process.env.CONTRACT_TOTAL_SUPPLY as string;
  const mintable = await new MintableErc20Factory(wallet).deploy(
    CONTRACT_NAME,
    CONTRACT_SYMBOL,
    CONTRACT_TOTAL_SUPPLY,
    CONTRACT_DECIMALS,
    overrides,
  );
  return { mintable };
}
