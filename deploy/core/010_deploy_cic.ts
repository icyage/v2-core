import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
const {ethers} = require('hardhat');
import {getConfigForChain} from '../../config/index';
import {getTxnOpts} from '../../scripts/deploy/helpers/getTxnOpts';
import {wait} from '../../scripts/getDepenencies';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const {deployments} = hre;
	const {deploy, execute, read} = deployments;
	const {config} = getConfigForChain(await hre.getChainId());
	const txnOpts = await getTxnOpts(hre);

	const edp = await deployments.get(`EligibilityDataProvider`);
	const middleFeeDistribution = await deployments.get(`MiddleFeeDistribution`);
	const LendingPoolConfiguratorImpl = await ethers.getContractFactory('LendingPoolConfigurator');
	const lendingPoolConfiguratorProxy = LendingPoolConfiguratorImpl.attach(
		await read('LendingPoolAddressesProvider', 'getLendingPoolConfigurator')
	);
	console.log(lendingPoolConfiguratorProxy.address);
	console.log(edp.address);
	console.log(middleFeeDistribution.address);

	const cic = await deploy('ChefIncentivesController', {
		...txnOpts,
		proxy: {
			proxyContract: 'OpenZeppelinTransparentProxy',
			execute: {
				init: {
					methodName: 'initialize',
					args: [
						lendingPoolConfiguratorProxy.address,
						edp.address,
						middleFeeDistribution.address,
						config.CIC_RPS,
					],
				},
			},
		},
	});

	// if (cic.newlyDeployed) {
	await execute('ChefIncentivesController', txnOpts, 'start');
	await execute('RadiantOFT', txnOpts, 'transfer', cic.address, config.SUPPLY_CIC_RESERVE);
	await wait(100);
	await execute('ChefIncentivesController', txnOpts, 'registerRewardDeposit', config.SUPPLY_CIC_RESERVE);
	await execute('EligibilityDataProvider', txnOpts, 'setChefIncentivesController', cic.address);
	await execute(`ChefIncentivesController`, txnOpts, 'setEndingTimeUpdateCadence', 86400);
	return true;
	// }
};
export default func;
func.id = 'cic';
func.tags = ['core'];
