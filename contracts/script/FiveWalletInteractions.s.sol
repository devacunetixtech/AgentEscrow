// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "forge-std/console2.sol";
import "../src/AgentEscrow.sol";

contract FiveWalletInteractions is Script {
    function run() external {
        uint256 funderKey = vm.envUint("PRIVATE_KEY");
        AgentEscrow escrow = AgentEscrow(vm.envAddress("AGENT_ESCROW_ADDRESS"));

        uint256[5] memory keys;
        address payable[5] memory wallets;

        for (uint256 i = 0; i < 5; i++) {
            keys[i] = uint256(keccak256(abi.encodePacked(funderKey, "AgentEscrow-mainnet-wallet", i + 1)));
            wallets[i] = payable(vm.addr(keys[i]));
        }

        // Fund each temporary wallet with a small amount for gas only.
        vm.startBroadcast(funderKey);
        for (uint256 i = 0; i < 5; i++) {
            wallets[i].transfer(0.006 ether);
        }
        vm.stopBroadcast();

        // Each wallet performs one real mainnet AgentEscrow interaction.
        for (uint256 i = 0; i < 5; i++) {
            vm.startBroadcast(keys[i]);
            uint256 jobId = escrow.createJob{value: 1 wei}(
                string.concat("mainnet-wallet-interaction-", vm.toString(i + 1)),
                block.timestamp + 30 days
            );
            vm.stopBroadcast();

            console2.log("WALLET", i + 1, wallets[i]);
            console2.log("JOB_ID", jobId);
        }
    }
}
