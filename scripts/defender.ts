const hre = require('hardhat');
const {AdminClient} = require('defender-admin-client');
const {deployments, getNamedAccounts, network} = hre;

let abi = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'asset',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'proxy',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'implementation',
				type: 'address',
			},
		],
		name: 'ATokenUpgraded',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'asset',
				type: 'address',
			},
		],
		name: 'BorrowingDisabledOnReserve',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'asset',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'bool',
				name: 'stableRateEnabled',
				type: 'bool',
			},
		],
		name: 'BorrowingEnabledOnReserve',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'asset',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'ltv',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'liquidationThreshold',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'liquidationBonus',
				type: 'uint256',
			},
		],
		name: 'CollateralConfigurationChanged',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'asset',
				type: 'address',
			},
		],
		name: 'ReserveActivated',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'asset',
				type: 'address',
			},
		],
		name: 'ReserveDeactivated',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'asset',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'decimals',
				type: 'uint256',
			},
		],
		name: 'ReserveDecimalsChanged',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'asset',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'factor',
				type: 'uint256',
			},
		],
		name: 'ReserveFactorChanged',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'asset',
				type: 'address',
			},
		],
		name: 'ReserveFrozen',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'asset',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'aToken',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'stableDebtToken',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'variableDebtToken',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'interestRateStrategyAddress',
				type: 'address',
			},
		],
		name: 'ReserveInitialized',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'asset',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'strategy',
				type: 'address',
			},
		],
		name: 'ReserveInterestRateStrategyChanged',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'asset',
				type: 'address',
			},
		],
		name: 'ReserveUnfrozen',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'asset',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'proxy',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'implementation',
				type: 'address',
			},
		],
		name: 'StableDebtTokenUpgraded',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'asset',
				type: 'address',
			},
		],
		name: 'StableRateDisabledOnReserve',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'asset',
				type: 'address',
			},
		],
		name: 'StableRateEnabledOnReserve',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'asset',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'proxy',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'implementation',
				type: 'address',
			},
		],
		name: 'VariableDebtTokenUpgraded',
		type: 'event',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'asset',
				type: 'address',
			},
		],
		name: 'activateReserve',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: 'address',
						name: 'aTokenImpl',
						type: 'address',
					},
					{
						internalType: 'address',
						name: 'stableDebtTokenImpl',
						type: 'address',
					},
					{
						internalType: 'address',
						name: 'variableDebtTokenImpl',
						type: 'address',
					},
					{
						internalType: 'uint8',
						name: 'underlyingAssetDecimals',
						type: 'uint8',
					},
					{
						internalType: 'address',
						name: 'interestRateStrategyAddress',
						type: 'address',
					},
					{
						internalType: 'address',
						name: 'underlyingAsset',
						type: 'address',
					},
					{
						internalType: 'address',
						name: 'treasury',
						type: 'address',
					},
					{
						internalType: 'address',
						name: 'incentivesController',
						type: 'address',
					},
					{
						internalType: 'uint256',
						name: 'allocPoint',
						type: 'uint256',
					},
					{
						internalType: 'string',
						name: 'underlyingAssetName',
						type: 'string',
					},
					{
						internalType: 'string',
						name: 'aTokenName',
						type: 'string',
					},
					{
						internalType: 'string',
						name: 'aTokenSymbol',
						type: 'string',
					},
					{
						internalType: 'string',
						name: 'variableDebtTokenName',
						type: 'string',
					},
					{
						internalType: 'string',
						name: 'variableDebtTokenSymbol',
						type: 'string',
					},
					{
						internalType: 'string',
						name: 'stableDebtTokenName',
						type: 'string',
					},
					{
						internalType: 'string',
						name: 'stableDebtTokenSymbol',
						type: 'string',
					},
					{
						internalType: 'bytes',
						name: 'params',
						type: 'bytes',
					},
				],
				internalType: 'struct ILendingPoolConfigurator.InitReserveInput[]',
				name: 'input',
				type: 'tuple[]',
			},
		],
		name: 'batchInitReserve',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'asset',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'ltv',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'liquidationThreshold',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'liquidationBonus',
				type: 'uint256',
			},
		],
		name: 'configureReserveAsCollateral',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'asset',
				type: 'address',
			},
		],
		name: 'deactivateReserve',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'asset',
				type: 'address',
			},
		],
		name: 'disableBorrowingOnReserve',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'asset',
				type: 'address',
			},
		],
		name: 'disableReserveStableRate',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'asset',
				type: 'address',
			},
			{
				internalType: 'bool',
				name: 'stableBorrowRateEnabled',
				type: 'bool',
			},
		],
		name: 'enableBorrowingOnReserve',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'asset',
				type: 'address',
			},
		],
		name: 'enableReserveStableRate',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'asset',
				type: 'address',
			},
		],
		name: 'freezeReserve',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'contract ILendingPoolAddressesProvider',
				name: 'provider',
				type: 'address',
			},
		],
		name: 'initialize',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bool',
				name: 'val',
				type: 'bool',
			},
		],
		name: 'setPoolPause',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'asset',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'reserveFactor',
				type: 'uint256',
			},
		],
		name: 'setReserveFactor',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'asset',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'rateStrategyAddress',
				type: 'address',
			},
		],
		name: 'setReserveInterestRateStrategyAddress',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'asset',
				type: 'address',
			},
		],
		name: 'unfreezeReserve',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: 'address',
						name: 'asset',
						type: 'address',
					},
					{
						internalType: 'address',
						name: 'treasury',
						type: 'address',
					},
					{
						internalType: 'address',
						name: 'incentivesController',
						type: 'address',
					},
					{
						internalType: 'string',
						name: 'name',
						type: 'string',
					},
					{
						internalType: 'string',
						name: 'symbol',
						type: 'string',
					},
					{
						internalType: 'address',
						name: 'implementation',
						type: 'address',
					},
					{
						internalType: 'bytes',
						name: 'params',
						type: 'bytes',
					},
				],
				internalType: 'struct ILendingPoolConfigurator.UpdateATokenInput',
				name: 'input',
				type: 'tuple',
			},
		],
		name: 'updateAToken',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: 'address',
						name: 'asset',
						type: 'address',
					},
					{
						internalType: 'address',
						name: 'incentivesController',
						type: 'address',
					},
					{
						internalType: 'string',
						name: 'name',
						type: 'string',
					},
					{
						internalType: 'string',
						name: 'symbol',
						type: 'string',
					},
					{
						internalType: 'address',
						name: 'implementation',
						type: 'address',
					},
					{
						internalType: 'bytes',
						name: 'params',
						type: 'bytes',
					},
				],
				internalType: 'struct ILendingPoolConfigurator.UpdateDebtTokenInput',
				name: 'input',
				type: 'tuple',
			},
		],
		name: 'updateStableDebtToken',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: 'address',
						name: 'asset',
						type: 'address',
					},
					{
						internalType: 'address',
						name: 'incentivesController',
						type: 'address',
					},
					{
						internalType: 'string',
						name: 'name',
						type: 'string',
					},
					{
						internalType: 'string',
						name: 'symbol',
						type: 'string',
					},
					{
						internalType: 'address',
						name: 'implementation',
						type: 'address',
					},
					{
						internalType: 'bytes',
						name: 'params',
						type: 'bytes',
					},
				],
				internalType: 'struct ILendingPoolConfigurator.UpdateDebtTokenInput',
				name: 'input',
				type: 'tuple',
			},
		],
		name: 'updateVariableDebtToken',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
];

(async () => {
	const {get, all, read} = deployments;

	const client = new AdminClient({apiKey: process.env.DEFENDER_API_KEY, apiSecret: process.env.DEFENDER_API_SECRET});
	const chainId = await hre.getChainId();
	const networks: {[k: string]: string} = {
		'56': 'bsc',
		'97': 'bsctest',
		'421613': 'arbitrum-goerli',
		'42161': 'arbitrum',
	};
	const chain: any = networks[chainId];
	let reset = true;

	let contracts = await client.listContracts();

	let defenderizedContracts = [
		'PoolHelper',
		'MFD',
		'ChefIncentivesController',
		'RadiantOFT',
		'BountyManager',
		'Compounder',
		'PriceProvider',
		'MiddleFeeDistribution',
		'LockZap',
		'LendingPoolConfigurator',
		'LendingPoolAddressesProvider',
		'ATokensAndRatesHelper',
		'LendingPoolConfigurator',
		'UniV2TwapOracle',
		// 'UniV3TwapOracle',
		// 'Migration',
	];

	let configurator;

	for (let deployment of defenderizedContracts) {
		let deploy;

		// if (deployment === 'LendingPoolConfigurator') {
		// 	configurator = {
		// 		address: '0x9F1DA1E699AbF392852A28339464943C28AEd5DF',
		// 		abi,
		// 	};
		// 	deploy = configurator;
		// } else {
		deploy = await deployments.get(deployment);
		// }
		const contract = {
			network: chain,
			address: deploy.address,
			name: deployment,
			abi: JSON.stringify(deploy.abi),
		};

		for (const c of contracts) {
			if (c.type == 'Contract') {
				if ((reset && c.network == chain) || (c.name == contract.name && c.network == network)) {
					await client.deleteContract(c.contractId);
				}
			}
		}
	}

	for (const deployment of defenderizedContracts) {
		let deploy;

		// if (deployment === 'LendingPoolConfigurator') {
		// 	deploy = configurator;
		// } else {
		deploy = await deployments.get(deployment);
		// }
		const contract = {
			network: chain,
			address: deploy.address,
			name: deployment,
			abi: JSON.stringify(deploy.abi),
		};
		await client.addContract(contract);
	}
})();
