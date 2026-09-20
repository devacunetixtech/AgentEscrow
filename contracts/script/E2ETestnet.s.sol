// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/AgentEscrow.sol";

contract E2ETestnet is Script {
    function run() external {
        uint256 clientKey = vm.envUint("PRIVATE_KEY");
        address escrowAddress = vm.envAddress("AGENT_ESCROW_ADDRESS");
        AgentEscrow escrow = AgentEscrow(escrowAddress);

        uint256 agentKey = uint256(keccak256(abi.encodePacked(clientKey, "AgentEscrow-e2e-agent")));
        address payable agent = payable(vm.addr(agentKey));

        vm.startBroadcast(clientKey);
        agent.transfer(0.01 ether);
        uint256 jobId = escrow.createJob{value: 0.001 ether}(
            "e2e://agent-escrow-testnet-job",
            block.timestamp + 1 days
        );
        vm.stopBroadcast();

        vm.startBroadcast(agentKey);
        escrow.acceptJob(jobId);
        escrow.submitWork(jobId, "e2e://completed");
        vm.stopBroadcast();

        vm.startBroadcast(clientKey);
        escrow.approveJob(jobId);
        vm.stopBroadcast();

        AgentEscrow.Job memory job = escrow.getJob(jobId);
        require(job.status == AgentEscrow.Status.Completed, "E2E_NOT_COMPLETED");
        require(job.reward == 0, "E2E_REWARD_NOT_RELEASED");

        console2.log("E2E_JOB_ID", jobId);
        console2.log("E2E_AGENT", agent);
        console2.log("E2E_STATUS_COMPLETED", true);
    }
}
