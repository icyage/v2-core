// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "../../dependencies/openzeppelin/upgradeability/Initializable.sol";
import "../../dependencies/openzeppelin/upgradeability/OwnableUpgradeable.sol";
import "../../interfaces/IChainlinkAggregator.sol";
import "../../interfaces/AggregatorV3Interface.sol";
import "../../interfaces/IBaseOracle.sol";

/// @title ChainlinkV3Adapter Contract
/// @author Radiant
/// @dev All function calls are currently implemented without side effects
contract ChainlinkV3Adapter is IBaseOracle, AggregatorV3Interface, OwnableUpgradeable {
	/// @notice Eth price feed
	AggregatorV3Interface public ethChainlinkFeed;
	/// @notice Token price feed
	AggregatorV3Interface public tokenChainlinkFeed;
	/// @notice Token address
	address public token;

	/// @notice Latest timestamp of eth price update
	uint256 public ethLatestTimestamp;
	/// @notice Latest timestamp of token price update
	uint256 public tokenLatestTimestamp;

	/**
	 * @notice Initializer
	 * @param _token Token address
	 * @param _ethChainlinkFeed Chainlink price feed for ETH.
	 * @param _tokenChainlinkFeed Chainlink price feed for token.
	 */
	function initialize(address _token, address _ethChainlinkFeed, address _tokenChainlinkFeed) external initializer {
		require(_token != address(0), "token is 0 address");
		require(_ethChainlinkFeed != address(0), "ethChainlinkFeed is 0 address");
		require(_tokenChainlinkFeed != address(0), "tokenChainlinkFeed is 0 address");
		ethChainlinkFeed = AggregatorV3Interface(_ethChainlinkFeed);
		tokenChainlinkFeed = AggregatorV3Interface(_tokenChainlinkFeed);
		token = _token;
		__Ownable_init();
	}

	/**
	 * @notice Returns USD price in quote token.
	 * @dev supports 18 decimal token
	 * @return price of token in decimal 8
	 */
	function latestAnswer() public view returns (uint256 price) {
		(, int256 answer, , , ) = tokenChainlinkFeed.latestRoundData();
		require(answer > 0, "Price must be positive");
		price = uint256(answer);
	}

	/**
	 * @notice Returns price in ETH
	 * @dev supports 18 decimal token
	 * @return price of token in decimal 8.
	 */
	function latestAnswerInEth() public view returns (uint256 price) {
		(, int256 tokenAnswer, , , ) = tokenChainlinkFeed.latestRoundData();
		(, int256 ethAnswer, , , ) = ethChainlinkFeed.latestRoundData();
		require(tokenAnswer > 0 && ethAnswer > 0, "Price must be positive");
		price = (uint256(tokenAnswer) * (10 ** 8)) / uint256(ethAnswer);
	}

	/**
	 * @notice Updates price
	 */
	function update() public {
		(, , , ethLatestTimestamp, ) = ethChainlinkFeed.latestRoundData();
		(, , , tokenLatestTimestamp, ) = tokenChainlinkFeed.latestRoundData();
	}

	/**
	 * @dev Check if update() can be called instead of wasting gas calling it.
	 */
	function canUpdate() public pure returns (bool) {
		return false;
	}

	/**
	 * @notice Returns current price.
	 */
	function consult() public view returns (uint256 price) {
		return latestAnswer();
	}

	/**
	 * @notice Returns version of chainlink price feed for token
	 */
	function version() external view returns (uint256) {
		return tokenChainlinkFeed.version();
	}

	/**
	 * @notice Returns decimals of chainlink price feed for token
	 */
	function decimals() external view returns (uint8) {
		return tokenChainlinkFeed.decimals();
	}

	/**
	 * @notice Returns description of chainlink price feed for token
	 */
	function description() external view returns (string memory) {
		return tokenChainlinkFeed.description();
	}

  /**
   * @notice Get data about a round
   * @param _roundId the requested round ID
   * @return roundId is the round ID from the aggregator for which the data was retrieved.
   * @return answer is the answer for the given round
   * @return startedAt is the timestamp when the round was started.
   * @return updatedAt is the timestamp when the round last was updated.
   * @return answeredInRound is the round ID of the round in which the answer was computed.
   */
	function getRoundData(
		uint80 _roundId
	)
		external
		view
		returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)
	{
		return tokenChainlinkFeed.getRoundData(_roundId);
	}

   /**
   * @notice Returns data of latest round
   * @return roundId is the round ID from the aggregator for which the data was retrieved.
   * @return answer is the answer for the given round
   * @return startedAt is the timestamp when the round was started.
   * @return updatedAt is the timestamp when the round last was updated.
   * @return answeredInRound is the round ID of the round in which the answer was computed.
   */
	function latestRoundData()
		public
		view
		returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)
	{
		return tokenChainlinkFeed.latestRoundData();
	}
}
