import { Web3Provider } from 'ethers/providers';
import { BigNumber, bigNumberify } from 'ethers/utils';

export function expandTo18Decimals(n: number): BigNumber {
  return bigNumberify(n).mul(bigNumberify(10).pow(18));
}

export function expandToDecimals(n: number, d: number): BigNumber {
  return bigNumberify(n).mul(bigNumberify(10).pow(d));
}

export async function mineBlock(provider: Web3Provider, timestamp: number): Promise<void> {
  await new Promise(async (resolve, reject) => {
    (provider._web3Provider.sendAsync as any)(
      { jsonrpc: '2.0', method: 'evm_mine', params: [timestamp] },
      (error: any, result: any): void => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );
  });
}
