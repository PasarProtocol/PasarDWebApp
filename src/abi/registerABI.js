module.exports.REGISTER_CONTRACT_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_codeAddress',
        type: 'address'
      }
    ],
    name: 'CodeUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_token',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'bool',
        name: '_isGeneralToken',
        type: 'bool'
      }
    ],
    name: 'GeneralTokenSet',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_token',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'string',
        name: '_name',
        type: 'string'
      },
      {
        indexed: false,
        internalType: 'string',
        name: '_uri',
        type: 'string'
      }
    ],
    name: 'TokenInfoUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_token',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_owner',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'string',
        name: '_name',
        type: 'string'
      },
      {
        indexed: false,
        internalType: 'string',
        name: '_uri',
        type: 'string'
      }
    ],
    name: 'TokenRegistered',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_token',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'address[]',
        name: '_royaltyOwners',
        type: 'address[]'
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: '_royaltyRates',
        type: 'uint256[]'
      }
    ],
    name: 'TokenRoyaltyChanged',
    type: 'event'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_token',
        type: 'address'
      },
      {
        internalType: 'address[]',
        name: '_royaltyOwners',
        type: 'address[]'
      },
      {
        internalType: 'uint256[]',
        name: '_royaltyRates',
        type: 'uint256[]'
      }
    ],
    name: 'changeTokenRoyalty',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getCodeAddress',
    outputs: [
      {
        internalType: 'address',
        name: '_codeAddress',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getMagic',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getVersion',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: '_tokens',
        type: 'address[]'
      },
      {
        internalType: 'string[]',
        name: '_names',
        type: 'string[]'
      },
      {
        internalType: 'string[]',
        name: '_uris',
        type: 'string[]'
      }
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'initialized',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_token',
        type: 'address'
      }
    ],
    name: 'isGeneralToken',
    outputs: [
      {
        internalType: 'bool',
        name: '_isGeneralToken',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_addr',
        type: 'address'
      }
    ],
    name: 'isRegistered',
    outputs: [
      {
        internalType: 'bool',
        name: '_registered',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_token',
        type: 'address'
      },
      {
        internalType: 'string',
        name: '_name',
        type: 'string'
      },
      {
        internalType: 'string',
        name: '_uri',
        type: 'string'
      }
    ],
    name: 'registerGeneralToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_token',
        type: 'address'
      },
      {
        internalType: 'string',
        name: '_name',
        type: 'string'
      },
      {
        internalType: 'string',
        name: '_uri',
        type: 'string'
      },
      {
        internalType: 'address[]',
        name: '_royaltyOwners',
        type: 'address[]'
      },
      {
        internalType: 'uint256[]',
        name: '_royaltyRates',
        type: 'uint256[]'
      }
    ],
    name: 'registerToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_token',
        type: 'address'
      },
      {
        internalType: 'bool',
        name: '_isGeneralToken',
        type: 'bool'
      }
    ],
    name: 'setGeneralToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: '_interfaceId',
        type: 'bytes4'
      }
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_index',
        type: 'uint256'
      }
    ],
    name: 'tokenByIndex',
    outputs: [
      {
        internalType: 'address',
        name: '_token',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'tokenCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '_count',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_token',
        type: 'address'
      }
    ],
    name: 'tokenInfo',
    outputs: [
      {
        internalType: 'string',
        name: '_uri',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_token',
        type: 'address'
      }
    ],
    name: 'tokenName',
    outputs: [
      {
        internalType: 'string',
        name: '_name',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_token',
        type: 'address'
      }
    ],
    name: 'tokenOwner',
    outputs: [
      {
        internalType: 'address',
        name: '_owner',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_token',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_id',
        type: 'uint256'
      }
    ],
    name: 'tokenRoyalty',
    outputs: [
      {
        internalType: 'address[]',
        name: '_owners',
        type: 'address[]'
      },
      {
        internalType: 'uint256[]',
        name: '_rates',
        type: 'uint256[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_newAddress',
        type: 'address'
      }
    ],
    name: 'updateCodeAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_token',
        type: 'address'
      },
      {
        internalType: 'string',
        name: '_name',
        type: 'string'
      },
      {
        internalType: 'string',
        name: '_uri',
        type: 'string'
      }
    ],
    name: 'updateTokenInfo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
];
