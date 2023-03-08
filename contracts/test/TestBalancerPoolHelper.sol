// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;
pragma abicoder v2;

import "../radiant/zap/helpers/BalancerPoolHelper.sol";

contract TestBalancerPoolHelper is BalancerPoolHelper {
	function sell(uint256 _amount) public returns (uint256 amountOut) {
		return
			swap(
				_amount,
				0x0000000000000000000000000000000000000000,
				0x0000000000000000000000000000000000000000,
				0x0000000000000000000000000000000000000000
			);
	}
}
