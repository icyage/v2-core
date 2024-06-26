/* eslint-disable no-await-in-loop */
import {BigNumber, BigNumberish} from 'ethers';
import hre, {ethers} from 'hardhat';

export async function mineBlock(): Promise<void> {
	await hre.network.provider.request({
		method: 'evm_mine',
	});
}

export async function setNextBlockTimestamp(timestamp: number): Promise<void> {
	await hre.network.provider.request({
		method: 'evm_setNextBlockTimestamp',
		params: [timestamp],
	});
}

export async function getLatestBlockTimestamp(): Promise<number> {
	return (await ethers.provider.getBlock('latest')).timestamp;
}

export async function mineBlockTo(blockNumber: number): Promise<void> {
	for (let i = await ethers.provider.getBlockNumber(); i < blockNumber; i += 1) {
		await mineBlock();
	}
}

export async function latest(): Promise<BigNumber> {
	const block = await ethers.provider.getBlock('latest');
	return BigNumber.from(block.timestamp);
}

export async function advanceTime(time: number): Promise<void> {
	await ethers.provider.send('evm_increaseTime', [time]);
}

export async function advanceTimeAndBlock(time: number): Promise<void> {
	await advanceTime(time);
	await mineBlock();
}

export const duration = {
	seconds(val: BigNumberish): BigNumber {
		return BigNumber.from(val);
	},
	minutes(val: BigNumberish): BigNumber {
		return BigNumber.from(val).mul(this.seconds('60'));
	},
	hours(val: BigNumberish): BigNumber {
		return BigNumber.from(val).mul(this.minutes('60'));
	},
	days(val: BigNumberish): BigNumber {
		return BigNumber.from(val).mul(this.hours('24'));
	},
	weeks(val: BigNumberish): BigNumber {
		return BigNumber.from(val).mul(this.days('7'));
	},
	years(val: BigNumberish): BigNumber {
		return BigNumber.from(val).mul(this.days('365'));
	},
};

// Defaults to e18 using amount * 10^18
export function getBigNumber(amount: BigNumberish, decimals = 18): BigNumber {
	return BigNumber.from(amount).mul(BigNumber.from(10).pow(decimals));
}
