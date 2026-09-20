// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "forge-std/console2.sol";
import "../src/AgentEscrow.sol";

contract E2EAgent {
    receive() external payable {}

    function accept(AgentEscrow escrow, uint256 jobId) external {
        escrow.acceptJob(jobId);
    }

    function submit(AgentEscrow escrow, uint256 jobId, string calldata submissionURI) external {
        escrow.submitWork(jobId, submissionURI);
    }
}

contract E2ETestnet is Script {
    function run() external {
        uint256 clientKey = vm.envUint("PRIVATE_KEY");
        address escrowAddress = vm.envAddress("AGENT_ESCROW_ADDRESS");
        AgentEscrow escrow = AgentEscrow(escrowAddress);

        vm.startBroadcast(clientKey);

        E2EAgent agent = new E2EAgent();

        uint256 jobId = escrow.createJob{value: 0.001 ether}(
            "e2e://agent-escrow-testnet-job",
            block.timestamp + 1 days
        );

        agent.accept(escrow, jobId);
        agent.submit(escrow, jobId, "e2e://completed");
        escrow.approveJob(jobId);

        vm.stopBroadcast();

        AgentEscrow.Job memory job = escrow.getJob(jobId);
        require(job.status == AgentEscrow.Status.Completed, "E2E_NOT_COMPLETED");
        require(job.reward == 0, "E2E_REWARD_NOT_RELEASED");
        require(job.agent == address(agent), "E2E_AGENT_MISMATCH");

        console2.log("E2E_JOB_ID", jobId);
        console2.log("E2E_AGENT", address(agent));
        console2.log("E2E_STATUS_COMPLETED", true);
    }
}
