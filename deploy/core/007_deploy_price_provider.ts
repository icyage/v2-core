import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {getConfigForChain} from '../../config/index';
import {network} from 'hardhat';
import {getWeth} from '../../scripts/getDepenencies';
import {LP_PROVIDER} from '../../scripts/deploy/types';
import {UniV2TwapOracle} from '../../typechain';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const {deployments, getNamedAccounts} = hre;
	const {deploy, execute, read} = deployments;
	const {deployer} = await getNamedAccounts();
	const {config} = getConfigForChain(await hre.getChainId());

	let poolHelper = await deployments.get('PoolHelper');
	const {chainlinkEthUsd} = await getWeth(hre);
	const stakingAddress = await read('PoolHelper', 'lpTokenAddr');
	let radiantToken = await deployments.get('RadiantOFT');

	const pp = await deploy('PriceProvider', {
		from: deployer,
		log: true,
		proxy: {
			proxyContract: 'OpenZeppelinTransparentProxy',
			execute: {
				init: {
					methodName: 'initialize',
					args: [chainlinkEthUsd, poolHelper.address],
				},
			},
		},
	});

	if (pp.newlyDeployed) {
		await execute('RadiantOFT', {from: deployer}, 'setPriceProvider', pp.address);
		await execute('LockZap', {from: deployer, log: true}, 'setPriceProvider', pp.address);
	}
};
export default func;
func.tags = ['core'];
