// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AgentEscrow {
    enum Status { Open, Accepted, Submitted, Completed, Cancelled, Expired }

    struct Job {
        uint256 id;
        address payable client;
        address payable agent;
        uint256 reward;
        uint256 deadline;
        string metadataURI;
        string submissionURI;
        Status status;
    }

    uint256 public jobCount;
    uint256 private locked = 1;
    mapping(uint256 => Job) private jobs;

    event JobCreated(uint256 indexed jobId, address indexed client, uint256 reward, uint256 deadline, string metadataURI);
    event JobAccepted(uint256 indexed jobId, address indexed agent);
    event WorkSubmitted(uint256 indexed jobId, address indexed agent, string submissionURI);
    event JobCompleted(uint256 indexed jobId, address indexed agent, uint256 reward);
    event JobCancelled(uint256 indexed jobId, address indexed client, uint256 refund);
    event JobExpired(uint256 indexed jobId, address indexed client, uint256 refund);

    modifier nonReentrant() {
        require(locked == 1, "REENTRANCY");
        locked = 2;
        _;
        locked = 1;
    }

    modifier existingJob(uint256 jobId) {
        require(jobId > 0 && jobId <= jobCount, "JOB_NOT_FOUND");
        _;
    }

    function createJob(string calldata metadataURI, uint256 deadline) external payable returns (uint256 jobId) {
        require(msg.value > 0, "REWARD_REQUIRED");
        require(deadline > block.timestamp, "INVALID_DEADLINE");
        require(bytes(metadataURI).length > 0, "METADATA_REQUIRED");

        jobId = ++jobCount;
        jobs[jobId] = Job(jobId, payable(msg.sender), payable(address(0)), msg.value, deadline, metadataURI, "", Status.Open);
        emit JobCreated(jobId, msg.sender, msg.value, deadline, metadataURI);
    }

    function acceptJob(uint256 jobId) external existingJob(jobId) {
        Job storage job = jobs[jobId];
        require(job.status == Status.Open, "NOT_OPEN");
        require(block.timestamp < job.deadline, "JOB_EXPIRED");
        require(msg.sender != job.client, "CLIENT_CANNOT_ACCEPT");
        job.agent = payable(msg.sender);
        job.status = Status.Accepted;
        emit JobAccepted(jobId, msg.sender);
    }

    function submitWork(uint256 jobId, string calldata submissionURI) external existingJob(jobId) {
        Job storage job = jobs[jobId];
        require(job.status == Status.Accepted, "NOT_ACCEPTED");
        require(msg.sender == job.agent, "NOT_AGENT");
        require(block.timestamp < job.deadline, "JOB_EXPIRED");
        require(bytes(submissionURI).length > 0, "SUBMISSION_REQUIRED");
        job.submissionURI = submissionURI;
        job.status = Status.Submitted;
        emit WorkSubmitted(jobId, msg.sender, submissionURI);
    }

    function approveJob(uint256 jobId) external nonReentrant existingJob(jobId) {
        Job storage job = jobs[jobId];
        require(job.status == Status.Submitted, "NOT_SUBMITTED");
        require(msg.sender == job.client, "NOT_CLIENT");
        uint256 amount = job.reward;
        job.reward = 0;
        job.status = Status.Completed;
        (bool ok,) = job.agent.call{value: amount}("");
        require(ok, "PAYMENT_FAILED");
        emit JobCompleted(jobId, job.agent, amount);
    }

    function cancelJob(uint256 jobId) external nonReentrant existingJob(jobId) {
        Job storage job = jobs[jobId];
        require(msg.sender == job.client, "NOT_CLIENT");
        require(job.status == Status.Open, "CANNOT_CANCEL");
        uint256 amount = job.reward;
        job.reward = 0;
        job.status = Status.Cancelled;
        (bool ok,) = job.client.call{value: amount}("");
        require(ok, "REFUND_FAILED");
        emit JobCancelled(jobId, job.client, amount);
    }

    function claimExpiredRefund(uint256 jobId) external nonReentrant existingJob(jobId) {
        Job storage job = jobs[jobId];
        require(msg.sender == job.client, "NOT_CLIENT");
        require(block.timestamp >= job.deadline, "NOT_EXPIRED");
        require(job.status == Status.Open || job.status == Status.Accepted, "NO_REFUND");
        uint256 amount = job.reward;
        job.reward = 0;
        job.status = Status.Expired;
        (bool ok,) = job.client.call{value: amount}("");
        require(ok, "REFUND_FAILED");
        emit JobExpired(jobId, job.client, amount);
    }

    function getJob(uint256 jobId) external view existingJob(jobId) returns (Job memory) {
        return jobs[jobId];
    }
}
