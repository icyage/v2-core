// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.8.12;
pragma abicoder v2;

import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";

import {Errors} from "../libraries/Errors.sol";
import {IBaseOracle} from "../../interfaces/IBaseOracle.sol";
import {IPoolHelper} from "../../interfaces/IPoolHelper.sol";
import {IChainlinkAggregator} from "../../interfaces/IChainlinkAggregator.sol";
import {IEligibilityDataProvider} from "../../interfaces/IEligibilityDataProvider.sol";
import {Initializable} from "../../dependencies/openzeppelin/upgradeability/Initializable.sol";
import {OwnableUpgradeable} from "../../dependencies/openzeppelin/upgradeability/OwnableUpgradeable.sol";

/// @title PriceProvider Contract
/// @author Radiant
/// @dev All function calls are currently implemented without side effects
contract PriceProvider is Initializable, OwnableUpgradeable {
	using SafeMath for uint256;

	/// @notice The period for price update, this is taken from heartbeats of chainlink price feeds
	uint256 public constant UPDATE_PERIOD = 86400;

	/// @notice Chainlink aggregator for USD price of base token
	IChainlinkAggregator public baseTokenPriceInUsdProxyAggregator;

	/// @notice Pool helper contract - Uniswap/Balancer
	IPoolHelper public poolHelper;

	/// @notice Eligibility data provider contract
	IEligibilityDataProvider public eligibilityProvider;

	/// @notice Base oracle contract
	IBaseOracle public oracle;

	bool private usePool;

	/********************** Events ***********************/

	event OracleUpdated(address indexed _newOracle);
	event PoolHelperUpdated(address indexed _poolHelper);
	event AggregatorUpdated(address indexed _baseTokenPriceInUsdProxyAggregator);
	event UsePoolUpdated(bool indexed _usePool);

	/**
	 * @notice Initializer
	 * @param _baseTokenPriceInUsdProxyAggregator Chainlink aggregator for USD price of base token
	 * @param _poolHelper Pool helper contract - Uniswap/Balancer
	 */
	function initialize(
		IChainlinkAggregator _baseTokenPriceInUsdProxyAggregator,
		IPoolHelper _poolHelper
	) public initializer {
		require(address(_baseTokenPriceInUsdProxyAggregator) != (address(0)), "Not a valid address");
		require(address(_poolHelper) != (address(0)), "Not a valid address");
		__Ownable_init();

		poolHelper = _poolHelper;
		baseTokenPriceInUsdProxyAggregator = _baseTokenPriceInUsdProxyAggregator;
		usePool = true;
	}

	/**
	 * @notice Update oracles.
	 */
	function update() public {
		if (address(oracle) != address(0) && oracle.canUpdate()) {
			oracle.update();
		}
	}

	/**
	 * @notice Returns the latest price in eth.
	 */
	function getTokenPrice() public view returns (uint256 priceInEth) {
		if (usePool) {
			// use sparingly, TWAP/CL otherwise
			priceInEth = poolHelper.getPrice();
		} else {
			priceInEth = oracle.latestAnswerInEth();
		}
	}

	/**
	 * @notice Returns the latest price in USD.
	 */
	function getTokenPriceUsd() public view returns (uint256 price) {
		if (usePool) {
			// use sparingly, TWAP/CL otherwise
			(, int256 answer,, uint256 updatedAt,) = IChainlinkAggregator(baseTokenPriceInUsdProxyAggregator).latestRoundData();
			if (updatedAt == 0) revert Errors.RoundNotComplete();
			if (block.timestamp - updatedAt >= UPDATE_PERIOD) revert Errors.StalePrice();
			if (answer <= 0) revert Errors.InvalidPrice();
			uint256 ethPrice = uint256(answer);
			uint256 priceInEth = poolHelper.getPrice();
			price = priceInEth.mul(ethPrice).div(10 ** 8);
		} else {
			price = oracle.latestAnswer();
		}
	}

	/**
	 * @notice Returns lp token price in ETH.
	 */
	function getLpTokenPrice() public view returns (uint256) {
		// decis 8
		uint256 rdntPriceInEth = getTokenPrice();
		return poolHelper.getLpPrice(rdntPriceInEth);
	}

	/**
	 * @notice Returns lp token price in USD.
	 */
	function getLpTokenPriceUsd() public view returns (uint256 price) {
		// decimals 8
		uint256 lpPriceInEth = getLpTokenPrice();
		// decimals 8
		(, int256 answer,, uint256 updatedAt,) = IChainlinkAggregator(baseTokenPriceInUsdProxyAggregator).latestRoundData();
		if (updatedAt == 0) revert Errors.RoundNotComplete();
		if (block.timestamp - updatedAt >= UPDATE_PERIOD) revert Errors.StalePrice();
		if (answer <= 0) revert Errors.InvalidPrice();
		uint256 ethPrice = uint256(answer);
		price = lpPriceInEth.mul(ethPrice).div(10 ** 8);
	}

	/**
	 * @notice Returns lp token address.
	 */
	function getLpTokenAddress() public view returns (address) {
		return poolHelper.lpTokenAddr();
	}

	/**
	 * @notice Sets new oracle.
	 */
	function setOracle(address _newOracle) external onlyOwner {
		require(_newOracle != address(0), "Invalid oracle address");
		oracle = IBaseOracle(_newOracle);
		emit OracleUpdated(_newOracle);
	}

	/**
	 * @notice Sets pool heler contract.
	 */
	function setPoolHelper(address _poolHelper) external onlyOwner {
		poolHelper = IPoolHelper(_poolHelper);
		require(getLpTokenPrice() != 0, "invalid oracle");
		emit PoolHelperUpdated(_poolHelper);
	}

	/**
	 * @notice Sets base token price aggregator.
	 */
	function setAggregator(address _baseTokenPriceInUsdProxyAggregator) external onlyOwner {
		baseTokenPriceInUsdProxyAggregator = IChainlinkAggregator(_baseTokenPriceInUsdProxyAggregator);
		require(getLpTokenPriceUsd() != 0, "invalid oracle");
		emit AggregatorUpdated(_baseTokenPriceInUsdProxyAggregator);
	}

	/**
	 * @notice Sets option to use pool.
	 */
	function setUsePool(bool _usePool) external onlyOwner {
		usePool = _usePool;
		emit UsePoolUpdated(_usePool);
	}

	/**
	 * @notice Returns decimals of price.
	 */
	function decimals() public pure returns (uint256) {
		return 8;
	}
}
