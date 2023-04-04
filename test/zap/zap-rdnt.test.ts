import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {ethers} from 'hardhat';
import {
	LendingPool,
	MultiFeeDistribution,
	RadiantOFT,
	VariableDebtToken,
	LockZap,
	WETH,
	PriceProvider,
} from '../../typechain';
import {expect} from 'chai';
import {setupTest} from '../setup';
import {advanceTimeAndBlock} from '../shared/helpers';
import {DeployConfig} from '../../scripts/deploy/types';

describe('LockZap: 2-token zap', function () {
	let dao: SignerWithAddress;
	let lockZap: LockZap;
	let weth: WETH;
	let lendingPool: LendingPool;
	let rdntToken: RadiantOFT;
	let multiFeeDistribution: MultiFeeDistribution;
	let priceProvider: PriceProvider;
	let deployConfig: DeployConfig;

	beforeEach(async function () {
		({dao, rdntToken, lendingPool, lockZap, weth, multiFeeDistribution, priceProvider, deployConfig} =
			await setupTest());

		// setup for a borrow
		const depositAmt = ethers.utils.parseUnits('100000', 18);
		await weth.connect(dao).mint(depositAmt);

		await weth.connect(dao).approve(lendingPool.address, ethers.constants.MaxUint256);
		await lendingPool.connect(dao).deposit(weth.address, depositAmt, dao.address, 0);

		const debtTokenAddress = await lockZap.getVDebtToken(weth.address);
		const vdWETH = <VariableDebtToken>await ethers.getContractAt('VariableDebtToken', debtTokenAddress);
		await vdWETH.connect(dao).approveDelegation(lockZap.address, ethers.constants.MaxUint256);
		await advanceTimeAndBlock(deployConfig.TWAP_PERIOD);
		await priceProvider.update();

		console.log(await priceProvider.getTokenPrice());
	});

	it('2-token zap, with borrow', async function () {
		let lockInfo = await multiFeeDistribution.lockedBalances(dao.address);
		expect(lockInfo.lockData.length).to.be.equal(0);

		const rdntZapAmt = ethers.utils.parseEther('100');
		console.log(await priceProvider.getTokenPrice());
		const wethAmt = await lockZap.quoteFromToken(rdntZapAmt);
		console.log(wethAmt);
		console.log(await rdntToken.balanceOf(dao.address));

		await rdntToken.connect(dao).approve(lockZap.address, ethers.constants.MaxUint256);

		await lockZap.connect(dao).zap(true, wethAmt, rdntZapAmt, 0);

		lockInfo = await multiFeeDistribution.lockedBalances(dao.address);
		expect(lockInfo.lockData.length).to.be.equal(1);
	});

	it('2-token zap, no borrow', async function () {
		let lockInfo = await multiFeeDistribution.lockedBalances(dao.address);
		expect(lockInfo.lockData.length).to.be.equal(0);

		const rdntZapAmt = ethers.utils.parseEther('100');
		const ethAmt = await lockZap.quoteFromToken(rdntZapAmt);

		await rdntToken.connect(dao).approve(lockZap.address, ethers.constants.MaxUint256);

		await lockZap.connect(dao).zap(false, 0, rdntZapAmt, 0, {
			value: ethAmt,
		});
		lockInfo = await multiFeeDistribution.lockedBalances(dao.address);
		expect(lockInfo.lockData.length).to.be.equal(1);
	});
});
