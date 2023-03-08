// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;
pragma abicoder v2;

import "./LockedBalance.sol";
import "./IFeeDistribution.sol";

interface IMultiFeeDistribution is IFeeDistribution {
	function exit(bool claimRewards) external;

	function stake(
		uint256 amount,
		address onBehalfOf,
		uint256 typeIndex
	) external;

	function lockInfo(address user) external view returns (LockedBalance[] memory);

	function defaultLockIndex(address _user) external view returns (uint256);

	function autoRelockDisabled(address user) external view returns (bool);

	function totalBalance(address user) external view returns (uint256);

	function zapVestingToLp(address _address) external returns (uint256);

	function withdrawExpiredLocksFor(address _address) external returns (uint256);

	function claimableRewards(address account) external view returns (IFeeDistribution.RewardData[] memory rewards);

	function setDefaultRelockTypeIndex(uint256 _index) external;

	function daoTreasury() external view returns (address);

	function stakingToken() external view returns (address);

	function mint(
		address user,
		uint256 amount,
		bool withPenalty
	) external;
}

interface IMFDPlus is IMultiFeeDistribution {
	function getLastClaimTime(address _user) external returns (uint256);

	function claimFromConverter(address) external;

	function bountyForUser(address _user) external view returns (IFeeDistribution.RewardData[] memory bounties);

	function claimBounty(address _user, bool _execute) external returns (uint256 bountyAmt, bool issueBaseBounty);

	function claimCompound(address _user, bool _execute) external returns (uint256 bountyAmt);

	function setAutocompound(bool _newVal) external;

	function getAutocompoundEnabled(address _user) external view returns (bool);
}
