import { AGENT_ESCROW_TESTNET_ADDRESS } from './deployment';

export const AGENT_ESCROW_ADDRESS =
  ((process.env.NEXT_PUBLIC_AGENT_ESCROW_ADDRESS || AGENT_ESCROW_TESTNET_ADDRESS) as `0x${string}`);

export const agentEscrowAbi = [
  {
    type: 'function',
    name: 'jobCount',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'getJob',
    stateMutability: 'view',
    inputs: [{ name: 'jobId', type: 'uint256' }],
    outputs: [
      {
        type: 'tuple',
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'client', type: 'address' },
          { name: 'agent', type: 'address' },
          { name: 'reward', type: 'uint256' },
          { name: 'deadline', type: 'uint256' },
          { name: 'metadataURI', type: 'string' },
          { name: 'submissionURI', type: 'string' },
          { name: 'status', type: 'uint8' },
        ],
      },
    ],
  },
  {
    type: 'function',
    name: 'createJob',
    stateMutability: 'payable',
    inputs: [
      { name: 'metadataURI', type: 'string' },
      { name: 'deadline', type: 'uint256' },
    ],
    outputs: [{ name: 'jobId', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'acceptJob',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'jobId', type: 'uint256' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'submitWork',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'jobId', type: 'uint256' },
      { name: 'submissionURI', type: 'string' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'approveJob',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'jobId', type: 'uint256' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'cancelJob',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'jobId', type: 'uint256' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'claimExpiredRefund',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'jobId', type: 'uint256' }],
    outputs: [],
  },
,
  {type:'event',name:'JobCreated',inputs:[{indexed:true,name:'jobId',type:'uint256'},{indexed:true,name:'client',type:'address'},{indexed:false,name:'reward',type:'uint256'},{indexed:false,name:'deadline',type:'uint256'},{indexed:false,name:'metadataURI',type:'string'}]},
  {type:'event',name:'JobAccepted',inputs:[{indexed:true,name:'jobId',type:'uint256'},{indexed:true,name:'agent',type:'address'}]},
  {type:'event',name:'WorkSubmitted',inputs:[{indexed:true,name:'jobId',type:'uint256'},{indexed:true,name:'agent',type:'address'},{indexed:false,name:'submissionURI',type:'string'}]},
  {type:'event',name:'JobCompleted',inputs:[{indexed:true,name:'jobId',type:'uint256'},{indexed:true,name:'agent',type:'address'},{indexed:false,name:'reward',type:'uint256'}]},
  {type:'event',name:'JobCancelled',inputs:[{indexed:true,name:'jobId',type:'uint256'},{indexed:true,name:'client',type:'address'},{indexed:false,name:'refund',type:'uint256'}]},
  {type:'event',name:'JobExpired',inputs:[{indexed:true,name:'jobId',type:'uint256'},{indexed:true,name:'client',type:'address'},{indexed:false,name:'refund',type:'uint256'}]}
] as const;

export const hasContractAddress =
  /^0x[a-fA-F0-9]{40}$/.test(AGENT_ESCROW_ADDRESS) && AGENT_ESCROW_ADDRESS !== '0x0000000000000000000000000000000000000000';
