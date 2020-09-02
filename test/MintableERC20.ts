import chai, { expect } from 'chai';
import { solidity, MockProvider, createFixtureLoader } from 'ethereum-waffle';
import { MintableErc20 } from '../typechain/MintableErc20';
import { mintableFixture } from './shared/fixtures';
import { BigNumberish, BigNumber } from 'ethers/utils';

chai.use(solidity);

const TEST_ADDRESSES: [string, string] = [
  '0x1000000000000000000000000000000000000000',
  '0x2000000000000000000000000000000000000000',
];

const CONTRACT_DECIMALS = process.env.CONTRACT_DECIMALS as string;
const CONTRACT_NAME = process.env.CONTRACT_NAME as string;
const CONTRACT_SYMBOL = process.env.CONTRACT_SYMBOL as string;
const CONTRACT_TOTAL_SUPPLY = process.env.CONTRACT_TOTAL_SUPPLY as string;
const PERMISSION_DENIED = 'MintableERC20: permission denied';

describe('MintableERC20', () => {
  const provider = new MockProvider({
    hardfork: 'istanbul',
    mnemonic: 'horn horn horn horn horn horn horn horn horn horn horn horn',
    gasLimit: 9999999,
  });
  const [wallet, other] = provider.getWallets();
  const loadFixture = createFixtureLoader(provider, [wallet, other]);
  let mintable: MintableErc20;
  beforeEach(async () => {
    const fixture = await loadFixture(mintableFixture);
    mintable = fixture.mintable;
  });

  it('totalSupply', async () => {
    expect(await mintable.totalSupply()).to.be.eq(CONTRACT_TOTAL_SUPPLY);
    expect(await mintable.balanceOf(wallet.address)).to.be.eq(CONTRACT_TOTAL_SUPPLY);
  });

  it('decimals', async () => {
    expect(await mintable.decimals()).to.be.eq(Number.parseInt(CONTRACT_DECIMALS));
  });

  it('name', async () => {
    expect(await mintable.name()).to.be.eq(CONTRACT_NAME);
  });

  it('symbol', async () => {
    expect(await mintable.symbol()).to.be.eq(CONTRACT_SYMBOL);
  });

  it('mintAmount, mintAmounts: non-maintainer cant mint', async () => {
    await expect(mintable.connect(other).mintAmount([TEST_ADDRESSES[0]], '100')).to.be.revertedWith(PERMISSION_DENIED);
    await expect(mintable.connect(other).mintAmounts([TEST_ADDRESSES[0]], ['100'])).to.be.revertedWith(
      PERMISSION_DENIED,
    );
  });

  it('mintAmount: owner can mint', async () => {
    const recipient = TEST_ADDRESSES[0];
    const amount: BigNumberish = '100';
    const initialTotalSupply = await mintable.totalSupply();
    const initialBalance = await mintable.balanceOf(recipient);

    await mintable.mintAmount([recipient], amount);

    expect(await mintable.totalSupply()).to.be.eq(initialTotalSupply.add(amount));
    expect(await mintable.balanceOf(recipient)).to.be.eq(initialBalance.add(amount));
  });

  it('mintAmount: maintainer can mint', async () => {
    const recipient = TEST_ADDRESSES[0];
    const amount: BigNumberish = '100';
    const initialTotalSupply = await mintable.totalSupply();
    const initialBalance = await mintable.balanceOf(recipient);

    await mintable.addMaintainer(other.address);
    await mintable.connect(other).mintAmount([recipient], amount);

    expect(await mintable.totalSupply()).to.be.eq(initialTotalSupply.add(amount));
    expect(await mintable.balanceOf(recipient)).to.be.eq(initialBalance.add(amount));
  });

  it('mintAmounts: owner can mint', async () => {
    const recipients = TEST_ADDRESSES;
    const amounts: BigNumber[] = ['100', '50'].map(s => new BigNumber(s));
    const totalAmounts = amounts.reduce((acc, v) => acc.add(v), new BigNumber(0));
    const initialBalances: BigNumber[] = await Promise.all(recipients.map(a => mintable.balanceOf(a)));
    const initialTotalSupply = await mintable.totalSupply();

    await mintable.mintAmounts(recipients, amounts);

    expect(await mintable.totalSupply()).to.be.eq(initialTotalSupply.add(totalAmounts));
    expect(amounts.length).to.be.eq(recipients.length);

    for (let i = 0; i < amounts.length; ++i) {
      expect(await mintable.balanceOf(recipients[i])).to.be.eq(initialBalances[i].add(amounts[i]));
    }
  });

  it('mintAmounts: maintainer can mint', async () => {
    const recipients = TEST_ADDRESSES;
    const amounts: BigNumber[] = ['100', '50'].map(s => new BigNumber(s));
    const totalAmounts = amounts.reduce((acc, v) => acc.add(v), new BigNumber(0));
    const initialBalances: BigNumber[] = await Promise.all(recipients.map(a => mintable.balanceOf(a)));
    const initialTotalSupply = await mintable.totalSupply();

    await mintable.addMaintainer(other.address);
    await mintable.connect(other).mintAmounts(recipients, amounts);

    expect(await mintable.totalSupply()).to.be.eq(initialTotalSupply.add(totalAmounts));
    expect(amounts.length).to.be.eq(recipients.length);

    for (let i = 0; i < amounts.length; ++i) {
      expect(await mintable.balanceOf(recipients[i])).to.be.eq(initialBalances[i].add(amounts[i]));
    }
  });

  it('addMaintainer, removeMaintainer, maintainers', async () => {
    const amount: BigNumberish = '100';
    const recipients = TEST_ADDRESSES;
    await mintable.addMaintainer(other.address);
    expect(await mintable.maintainers()).to.deep.eq([other.address]);
    await mintable.addMaintainer(recipients[0]);
    await mintable.addMaintainer(recipients[1]);
    expect(new Set(await mintable.maintainers())).to.deep.eq(new Set([other.address, recipients[0], recipients[1]]));
    await mintable.connect(other).mintAmount([recipients[0]], amount);
    expect(mintable.connect(other).removeMaintainer(recipients[0])).to.be.revertedWith(
      'Ownable: caller is not the owner',
    );
    await mintable.removeMaintainer(other.address);
    await expect(mintable.connect(other).mintAmount([recipients[0]], '100')).to.be.revertedWith(PERMISSION_DENIED);
    expect(new Set(await mintable.maintainers())).to.deep.eq(new Set([recipients[0], recipients[1]]));
  });
});
