module.exports.COMMON_CONTRACT_ABI = [
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'string', name: '', internalType: 'string' }],
    name: 'name',
    inputs: []
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'string', name: '', internalType: 'string' }],
    name: 'symbol',
    inputs: []
  },
  {
    type: 'function',
    stateMutability: 'view',
    inputs: [{ type: 'bytes4', name: '_interfaceId', internalType: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ type: 'bool', name: '', internalType: 'bool' }]
  },
  {
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    name: 'owner',
    outputs: [{ type: 'address', name: '', internalType: 'address' }]
  }
];
