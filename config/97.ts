
import { ethers } from "ethers";
import { DeployConfig, LP_PROVIDER } from "../scripts/deploy/types";
import { getInitLpAmts } from "../scripts/deploy/helpers/getInitLpAmts";
import BaseConfig from "./BaseConfig";
import { MINUTE } from "./constants";

const LOCK_TIME: number = 12 * MINUTE;
const REWARDS_DURATION = 6 * MINUTE;
const LOOKBACK_DURATION = 3 * MINUTE;

const LP_PLATFORM = LP_PROVIDER.UNISWAP;
const LP_INIT_ETH = 200;
export const targetPrice = .12;
export const ethPrice = 1600;
const LP_INIT_RDNT = getInitLpAmts(LP_PLATFORM, LP_INIT_ETH, ethPrice, targetPrice);

const chainConfig = {
  "NETWORK": "bsc-testnet",
  "CHAIN_ID": 97,
  "TESTNET": true,
  "DEPLOY_WETH": true,
  "DEPLOY_DELAY": 10,

  "MINT_AMT": ethers.utils.parseUnits("10000", 18),


  "MFD_REWARD_DURATION_SECS": REWARDS_DURATION.toString(),
  "MFD_REWARD_LOOKBACK_SECS": LOOKBACK_DURATION.toString(),
  "MFD_LOCK_DURATION_SECS": LOCK_TIME.toString(),
  "MFD_VEST_DURATION": 30 * MINUTE,
  "LOCK_INFO": {
    "LOCK_PERIOD": [LOCK_TIME, LOCK_TIME * 3, LOCK_TIME * 6, LOCK_TIME * 12],
    "MULTIPLIER": [1, 4, 10, 25],
  },

  "SUPPLY_MAX": ethers.utils.parseUnits("1000000000", 18),
  "SUPPLY_MAX_MINT": ethers.utils.parseUnits("100000000", 18),
  "SUPPLY_LP_MINT": ethers.utils.parseUnits("1000000", 18),
  "SUPPLY_TEAM_MINT": ethers.utils.parseUnits("1000000", 18),
  "SUPPLY_TEAM_VEST": ethers.utils.parseUnits("1000000", 18),
  "SUPPLY_ECO_MINT": ethers.utils.parseUnits("10000000", 18),
  "SUPPLY_CIC_RESERVE": ethers.utils.parseUnits("2000000", 18),
  "SUPPLY_MIGRATION_MINT": ethers.utils.parseUnits("10000000", 18),
  "SUPPLY_DQ_RESERVE": ethers.utils.parseUnits("100000", 18),

  "LP_PROVIDER": LP_PLATFORM,
  "LP_INIT_ETH": ethers.utils.parseUnits(LP_INIT_ETH.toString(), 18),
  "LP_INIT_RDNT": ethers.utils.parseUnits(LP_INIT_RDNT.toString(), 18),

  "CIC_RPS": ethers.utils.parseUnits(".1", 18),

  "DQ_TARGET_BASE_BOUNTY_USD": ethers.utils.parseUnits("5", 18),
  "DQ_BOOSTER": ethers.utils.parseUnits("0", 18),
  "DQ_MAX_BASE_BOUNTY": ethers.utils.parseUnits("100", 18),

  "RADIANT_V1": "0x0000000000000000000000000000000000000000",

  // will be redeployed on this testnet
  "WETH_ADDRESS": "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6",
  // will be redeployed on this testnet
  "ROUTER_ADDR": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  "BAL_WEIGHTED_POOL_FACTORY": "0x8E9aa87E45e92bad84D5F8DD1bff34Fb92637dE9",
  "BAL_VAULT": "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
  "BAL_WSTETH_POOL": "",
  "STARGATE_ROUTER": "0xbB0f1be1E9CE9cB27EA5b0c3a85B7cc3381d8176",
  "STARGATE_ROUTER_ETH": "0x7612aE2a34E5A363E137De748801FB4c86499152",
  "LZ_ENDPOINT": "0x6Fcb97553D41516Cb228ac03FdC8B9a0a9df04A1",
  "CHAINLINK_AGGREGATOR_PROXY": "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
  "CHAINLINK_ETH_USD_AGGREGATOR_PROXY": "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",

  "TOKENS_CONFIG": [
    [
      "BUSD",
      {
        "assetAddress": "0xAcC72499488550d88348a01CbAD3955036C53F13",
        "chainlinkAggregator": "0x9331b55D9830EF609A2aBCfAc0FBCE050A52fdEa",
        "borrowRate": "39000000000000000000000000",
        "reservesParams": {
          "aTokenImpl": "AToken",
          "baseLTVAsCollateral": "8000",
          "borrowingEnabled": true,
          "liquidationBonus": "11500",
          "liquidationThreshold": "8500",
          "reserveDecimals": "6",
          "reserveFactor": BaseConfig.RESERVE_FACTOR,
          "stableBorrowRateEnabled": false,
          "strategy": {
            "baseVariableBorrowRate": "0",
            "name": "rateStrategyStableThree",
            "optimalUtilizationRate": "900000000000000000000000000",
            "variableRateSlope1": "40000000000000000000000000",
            "variableRateSlope2": "600000000000000000000000000",
            "stableRateSlope1": "20000000000000000000000000",
            "stableRateSlope2": "600000000000000000000000000"
          }
        },
        "initInputParams": {
          "aTokenImpl": "0x0000000000000000000000000000000000000000",
          "aTokenName": "Radiant interest bearing USDC",
          "aTokenSymbol": "rUSDC",
          "incentivesController": "0x0000000000000000000000000000000000000000",
          "interestRateStrategyAddress":
            "0x0000000000000000000000000000000000000000",
          "params": "0x10",
          "stableDebtTokenImpl": "0x0000000000000000000000000000000000000000",
          "stableDebtTokenName": "Radiant stable debt bearing USDC",
          "stableDebtTokenSymbol": "stableDebtUSDC",
          "treasury": "0x0000000000000000000000000000000000000000",
          "underlyingAsset": "0xAcC72499488550d88348a01CbAD3955036C53F13",
          "underlyingAssetDecimals": "18",
          "underlyingAssetName": "BUSD",
          "variableDebtTokenImpl": "0x0000000000000000000000000000000000000000",
          "variableDebtTokenName": "Radiant variable debt bearing USDC",
          "variableDebtTokenSymbol": "variableDebtUSDC",
          "allocPoint": 100
        }
      }
    ],
    [
      "USDT",
      {
        "assetAddress": "0xACeaBe6d8c71D73E8c34c761526A10B933F5e878",
        "chainlinkAggregator": "0xEca2605f0BCF2BA5966372C99837b1F182d3D620",
        "borrowRate": "39000000000000000000000000",
        "reservesParams": {
          "aTokenImpl": "AToken",
          "baseLTVAsCollateral": "8000",
          "borrowingEnabled": true,
          "liquidationBonus": "11500",
          "liquidationThreshold": "8500",
          "reserveDecimals": "6",
          "reserveFactor": BaseConfig.RESERVE_FACTOR,
          "stableBorrowRateEnabled": false,
          "strategy": {
            "baseVariableBorrowRate": "0",
            "name": "rateStrategyStableThree",
            "optimalUtilizationRate": "900000000000000000000000000",
            "variableRateSlope1": "40000000000000000000000000",
            "variableRateSlope2": "600000000000000000000000000",
            "stableRateSlope1": "20000000000000000000000000",
            "stableRateSlope2": "600000000000000000000000000"
          }
        },
        "initInputParams": {
          "aTokenImpl": "0x0000000000000000000000000000000000000000",
          "aTokenName": "Radiant interest bearing USDT",
          "aTokenSymbol": "rUSDT",
          "incentivesController": "0x0000000000000000000000000000000000000000",
          "interestRateStrategyAddress":
            "0x0000000000000000000000000000000000000000",
          "params": "0x10",
          "stableDebtTokenImpl": "0x0000000000000000000000000000000000000000",
          "stableDebtTokenName": "Radiant stable debt bearing USDT",
          "stableDebtTokenSymbol": "stableDebtUSDT",
          "treasury": "0x0000000000000000000000000000000000000000",
          "underlyingAsset": "0xACeaBe6d8c71D73E8c34c761526A10B933F5e878",
          "underlyingAssetDecimals": "18",
          "underlyingAssetName": "USDT",
          "variableDebtTokenImpl": "0x0000000000000000000000000000000000000000",
          "variableDebtTokenName": "Radiant variable debt bearing USDT",
          "variableDebtTokenSymbol": "variableDebtUSDT",
          "allocPoint": 100
        }
      }
    ],
    [
      "DAI",
      {
        "assetAddress": "0x9fC74EFC9EBafc0cEfb15076d6887B89dEC93F2b",
        "chainlinkAggregator": "0xE4eE17114774713d2De0eC0f035d4F7665fc025D",
        "borrowRate": "39000000000000000000000000",
        "reservesParams": {
          "aTokenImpl": "AToken",
          "baseLTVAsCollateral": "7500",
          "borrowingEnabled": true,
          "liquidationBonus": "11500",
          "liquidationThreshold": "8500",
          "reserveDecimals": "18",
          "reserveFactor": BaseConfig.RESERVE_FACTOR,
          "stableBorrowRateEnabled": false,
          "strategy": {
            "baseVariableBorrowRate": "0",
            "name": "rateStrategyStableTwo",
            "optimalUtilizationRate": "800000000000000000000000000",
            "variableRateSlope1": "40000000000000000000000000",
            "variableRateSlope2": "750000000000000000000000000",
            "stableRateSlope1": "20000000000000000000000000",
            "stableRateSlope2": "750000000000000000000000000"
          }
        },
        "initInputParams": {
          "aTokenImpl": "0x0000000000000000000000000000000000000000",
          "aTokenName": "Radiant interest bearing DAI",
          "aTokenSymbol": "rDAI",
          "incentivesController": "0x0000000000000000000000000000000000000000",
          "interestRateStrategyAddress":
            "0x0000000000000000000000000000000000000000",
          "params": "0x10",
          "stableDebtTokenImpl": "0x0000000000000000000000000000000000000000",
          "stableDebtTokenName": "Radiant stable debt bearing DAI",
          "stableDebtTokenSymbol": "stableDebtDAI",
          "treasury": "0x0000000000000000000000000000000000000000",
          "underlyingAsset": "0x9fC74EFC9EBafc0cEfb15076d6887B89dEC93F2b",
          "underlyingAssetDecimals": "18",
          "underlyingAssetName": "DAI",
          "variableDebtTokenImpl": "0x0000000000000000000000000000000000000000",
          "variableDebtTokenName": "Radiant variable debt bearing DAI",
          "variableDebtTokenSymbol": "variableDebtDAI",
          "allocPoint": 100
        }
      }
    ],
    [
      "WETH",
      {
        "assetAddress": "0xeF7Ef563f36DcBA7F74288cf195BEcc3d1D0cc65",
        "chainlinkAggregator": "0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7",
        "borrowRate": "30000000000000000000000000",
        "reservesParams": {
          "aTokenImpl": "AToken",
          "baseLTVAsCollateral": "8000",
          "borrowingEnabled": true,
          "liquidationBonus": "11500",
          "liquidationThreshold": "8250",
          "reserveDecimals": "18",
          "reserveFactor": BaseConfig.RESERVE_FACTOR,
          "stableBorrowRateEnabled": false,
          "strategy": {
            "baseVariableBorrowRate": "0",
            "name": "rateStrategyWETH",
            "optimalUtilizationRate": "650000000000000000000000000",
            "variableRateSlope1": "80000000000000000000000000",
            "variableRateSlope2": "1000000000000000000000000000",
            "stableRateSlope1": "100000000000000000000000000",
            "stableRateSlope2": "1000000000000000000000000000"
          }
        },
        "initInputParams": {
          "aTokenImpl": "0x0000000000000000000000000000000000000000",
          "aTokenName": "Radiant interest bearing WETH",
          "aTokenSymbol": "rWETH",
          "incentivesController": "0x0000000000000000000000000000000000000000",
          "interestRateStrategyAddress":
            "0x0000000000000000000000000000000000000000",
          "params": "0x10",
          "stableDebtTokenImpl": "0x0000000000000000000000000000000000000000",
          "stableDebtTokenName": "Radiant stable debt bearing WETH",
          "stableDebtTokenSymbol": "stableDebtWETH",
          "treasury": "0x0000000000000000000000000000000000000000",
          "underlyingAsset": "0xeF7Ef563f36DcBA7F74288cf195BEcc3d1D0cc65",
          "underlyingAssetDecimals": "18",
          "underlyingAssetName": "WETH",
          "variableDebtTokenImpl": "0x0000000000000000000000000000000000000000",
          "variableDebtTokenName": "Radiant variable debt bearing WETH",
          "variableDebtTokenSymbol": "variableDebtWETH",
          "allocPoint": 100
        }
      }
    ],
    [
      "WBTC",
      {
        "assetAddress": "0xCC9ACe9D464ac3f115416eEc4efD4EB13559D9c8",
        "chainlinkAggregator": "0x5741306c21795FdCBb9b265Ea0255F499DFe515C",
        "borrowRate": "30000000000000000000000000",
        "reservesParams": {
          "aTokenImpl": "AToken",
          "baseLTVAsCollateral": "8000",
          "borrowingEnabled": true,
          "liquidationBonus": "11500",
          "liquidationThreshold": "8250",
          "reserveDecimals": "18",
          "reserveFactor": BaseConfig.RESERVE_FACTOR,
          "stableBorrowRateEnabled": false,
          "strategy": {
            "baseVariableBorrowRate": "0",
            "name": "rateStrategyWBTC",
            "optimalUtilizationRate": "650000000000000000000000000",
            "variableRateSlope1": "80000000000000000000000000",
            "variableRateSlope2": "1000000000000000000000000000",
            "stableRateSlope1": "100000000000000000000000000",
            "stableRateSlope2": "1000000000000000000000000000"
          }
        },
        "initInputParams": {
          "aTokenImpl": "0x0000000000000000000000000000000000000000",
          "aTokenName": "Radiant interest bearing WBTC",
          "aTokenSymbol": "rWBTC",
          "incentivesController": "0x0000000000000000000000000000000000000000",
          "interestRateStrategyAddress":
            "0x0000000000000000000000000000000000000000",
          "params": "0x10",
          "stableDebtTokenImpl": "0x0000000000000000000000000000000000000000",
          "stableDebtTokenName": "Radiant stable debt bearing WBTC",
          "stableDebtTokenSymbol": "stableDebtWBTC",
          "treasury": "0x0000000000000000000000000000000000000000",
          "underlyingAsset": "0xCC9ACe9D464ac3f115416eEc4efD4EB13559D9c8",
          "underlyingAssetDecimals": "18",
          "underlyingAssetName": "WBTC",
          "variableDebtTokenImpl": "0x0000000000000000000000000000000000000000",
          "variableDebtTokenName": "Radiant variable debt bearing WBTC",
          "variableDebtTokenSymbol": "variableDebtWBTC",
          "allocPoint": 100
        }
      }
    ],
    [
      "WBNB",
      {
        "assetAddress": "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
        "chainlinkAggregator": "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526",
        "borrowRate": "30000000000000000000000000",
        "reservesParams": {
          "aTokenImpl": "AToken",
          "baseLTVAsCollateral": "8000",
          "borrowingEnabled": true,
          "liquidationBonus": "11500",
          "liquidationThreshold": "8250",
          "reserveDecimals": "18",
          "reserveFactor": BaseConfig.RESERVE_FACTOR,
          "stableBorrowRateEnabled": false,
          "strategy": {
            "baseVariableBorrowRate": "0",
            "name": "rateStrategyWBNB",
            "optimalUtilizationRate": "650000000000000000000000000",
            "variableRateSlope1": "80000000000000000000000000",
            "variableRateSlope2": "1000000000000000000000000000",
            "stableRateSlope1": "100000000000000000000000000",
            "stableRateSlope2": "1000000000000000000000000000"
          }
        },
        "initInputParams": {
          "aTokenImpl": "0x0000000000000000000000000000000000000000",
          "aTokenName": "Radiant interest bearing WBNB",
          "aTokenSymbol": "rWBNB",
          "incentivesController": "0x0000000000000000000000000000000000000000",
          "interestRateStrategyAddress":
            "0x0000000000000000000000000000000000000000",
          "params": "0x10",
          "stableDebtTokenImpl": "0x0000000000000000000000000000000000000000",
          "stableDebtTokenName": "Radiant stable debt bearing WBNB",
          "stableDebtTokenSymbol": "stableDebtWBNB",
          "treasury": "0x0000000000000000000000000000000000000000",
          "underlyingAsset": "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
          "underlyingAssetDecimals": "18",
          "underlyingAssetName": "WBNB",
          "variableDebtTokenImpl": "0x0000000000000000000000000000000000000000",
          "variableDebtTokenName": "Radiant variable debt bearing WBNB",
          "variableDebtTokenSymbol": "variableDebtWBNB",
          "allocPoint": 100
        }
      }
    ]
  ],
  "STARGATE_CONFIG": {
    "ASSETS": ["0xCb2A18E5328Daf9eeF62C6D2DF415a27D7118b23", "0xa43A5FD4a2ce19B5fFcf00065FcC877392C326bf", "0x479df35c7EDa9AE8B2086F54b6c42115D8a971D9"],
    "POOL_IDS": [1, 2, 3]
  }
}

const BscTestnetDeployConfig: DeployConfig = { ...BaseConfig, ...chainConfig };
export default BscTestnetDeployConfig;