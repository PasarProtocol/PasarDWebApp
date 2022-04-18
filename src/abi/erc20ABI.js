module.exports.ERC20_CONTRACT_ABI = [
  {
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { type: 'address', name: 'owner', internalType: 'address' },
      { type: 'address', name: 'spender', internalType: 'address' }
    ],
    name: 'allowance',
    outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }]
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { type: 'address', name: 'spender', internalType: 'address' },
      { type: 'uint256', name: 'amount', internalType: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ type: 'bool', name: '', internalType: 'bool' }]
  }
];
