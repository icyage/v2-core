pragma solidity ^0.8.0;
import "../../dependencies/openzeppelin/upgradeability/OwnableUpgradeable.sol";
import "../../interfaces/IChainlinkAggregator.sol";
import "../../interfaces/AggregatorV3Interface.sol";
import "../../interfaces/IBaseOracle.sol";

/// @notice Provides wstETH/USD price using stETH/USD Chainlink oracle and wstETH/stETH exchange rate provided by stETH smart contract
contract WSTETHOracle is OwnableUpgradeable {
	/// @notice The period for price update, this is taken from heartbeats of chainlink price feeds
	uint256 public constant UPDATE_PERIOD = 86400;

	AggregatorV3Interface public stETHUSDOracle;
	AggregatorV3Interface public stEthPerWstETHOracle;

	error RoundNotComplete();

	error StalePrice();

	error NegativePrice();

	function initialize(address _stETHUSDOracle, address _stEthPerWstETHOracle) public initializer {
		stETHUSDOracle = AggregatorV3Interface(_stETHUSDOracle); //8 decimals
		stEthPerWstETHOracle = AggregatorV3Interface(_stEthPerWstETHOracle); //18 decimals
		__Ownable_init();
	}

	function decimals() external view returns (uint8) {
		return 8;
	}

	function description() external view returns (string memory) {
		return "WSTETH/USD";
	}

	function latestTimestamp() external view returns (uint256) {
		(
			,
			,
			,
			//uint80 roundId
			//int256 answer
			//uint256 startedAt
			uint256 updatedAt, //uint256 answeredInRound

		) = stETHUSDOracle.latestRoundData();
		return updatedAt;
	}

	/// @notice Get wstETH/ETH price. It does not check Chainlink oracle staleness! If staleness check needed, it's recommended to use latestTimestamp() function
	/// @return answer wstETH/ETH price or 0 if failure
	function latestAnswer() external view returns (int256 answer) {
		int256 stETHPrice = _getAnswer(stETHUSDOracle);
		int256 wstETHRatio = _getAnswer(stEthPerWstETHOracle);

		answer = (stETHPrice * wstETHRatio) / 1 ether;
	}

	function version() external view returns (uint256) {
		return 1;
	}

	function _getAnswer(AggregatorV3Interface chainlinkFeed) internal view returns (int256) {
		(, int256 answer, , uint256 updatedAt, ) = chainlinkFeed.latestRoundData();
		if(updatedAt == 0) revert RoundNotComplete();
		if(block.timestamp - updatedAt >= UPDATE_PERIOD) revert StalePrice();
		if(answer <= 0) revert InvalidPrice();
		return answer;
	}
}
