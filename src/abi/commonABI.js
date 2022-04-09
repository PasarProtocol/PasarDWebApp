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
    type: "function",
    stateMutability: "view",
    inputs: [
      {
        "internalType": "bytes4",
        "name": "_interfaceId",
        "type": "bytes4"
      }
    ],
    name: "supportsInterface",
    outputs: [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
  }
];