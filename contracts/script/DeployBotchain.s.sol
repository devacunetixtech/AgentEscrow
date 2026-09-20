// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "forge-std/Script.sol";
import "../src/AgentEscrow.sol";
contract DeployBotchain is Script {
    function run() external returns (AgentEscrow escrow) {
        uint256 key = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(key);
        escrow = new AgentEscrow();
        vm.stopBroadcast();
    }
}
