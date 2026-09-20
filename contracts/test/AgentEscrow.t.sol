// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/AgentEscrow.sol";

contract AgentEscrowTest is Test {
    AgentEscrow escrow;
    address client = address(0xC1);
    address agent = address(0xA1);

    function setUp() public {
        escrow = new AgentEscrow();
        vm.deal(client, 100 ether);
    }

    function testHappyPath() public {
        vm.prank(client);
        uint256 id = escrow.createJob{value: 10 ether}("ipfs://job", block.timestamp + 1 days);
        vm.prank(agent); escrow.acceptJob(id);
        vm.prank(agent); escrow.submitWork(id, "ipfs://work");
        uint256 beforeBal = agent.balance;
        vm.prank(client); escrow.approveJob(id);
        assertEq(agent.balance, beforeBal + 10 ether);
        assertEq(uint8(escrow.getJob(id).status), uint8(AgentEscrow.Status.Completed));
    }

    function testOpenJobCancellationRefundsClient() public {
        uint256 beforeBal = client.balance;
        vm.prank(client);
        uint256 id = escrow.createJob{value: 10 ether}("ipfs://job", block.timestamp + 1 days);
        vm.prank(client); escrow.cancelJob(id);
        assertEq(client.balance, beforeBal);
    }

    function testExpiredAcceptedJobRefundsClient() public {
        vm.prank(client);
        uint256 id = escrow.createJob{value: 10 ether}("ipfs://job", block.timestamp + 1 days);
        vm.prank(agent); escrow.acceptJob(id);
        vm.warp(block.timestamp + 1 days);
        vm.prank(client); escrow.claimExpiredRefund(id);
        assertEq(uint8(escrow.getJob(id).status), uint8(AgentEscrow.Status.Expired));
    }
}
