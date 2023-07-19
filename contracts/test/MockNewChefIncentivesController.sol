// SPDX-License-Identifier: MIT

pragma solidity 0.8.12;

import "../radiant/staking/ChefIncentivesController.sol";

contract MockNewChefIncentivesController is ChefIncentivesController {
	function mockNewFunction() external pure returns (bool) {
		return true;
	}
}
