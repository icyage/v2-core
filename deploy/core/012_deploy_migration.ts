import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {getConfigForChain} from '../../config/index';
import {ethers} from 'hardhat';
import {getTxnOpts} from '../../scripts/deploy/helpers/getTxnOpts';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const {deployments, getNamedAccounts} = hre;
	const {deploy, execute, read} = deployments;
	const {deployer, dao} = await getNamedAccounts();
	const {config} = getConfigForChain(await hre.getChainId());
	const txnOpts = await getTxnOpts(hre);

	const radiantToken = await deployments.get('RadiantOFT');
	let rdntV1Addr;
	if (config.CHAIN_ID == 42161) {
		if (!!config.RADIANT_V1 && config.RADIANT_V1 === '0x0000000000000000000000000000000000000000') {
			let rdntV1 = await deploy('RDNTV1', {
				...txnOpts,
				contract: 'MockToken',
				args: ['Radiant V1', 'Radiant V1', 18],
			});
			if (rdntV1.newlyDeployed) {
				await execute('RDNTV1', txnOpts, 'mint', deployer, ethers.utils.parseUnits('100000', 18));
			}
			rdntV1Addr = rdntV1.address;
		} else {
			rdntV1Addr = config.RADIANT_V1;
		}

		const migration = await deploy('Migration', {
			...txnOpts,
			args: [rdntV1Addr, radiantToken.address],
		});

		if (migration.newlyDeployed) {
			await execute('RadiantOFT', txnOpts, 'transfer', migration.address, config.SUPPLY_MIGRATION_MINT);
		}
	}
};
export default func;
func.tags = ['core'];
