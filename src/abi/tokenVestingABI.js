module.exports.TOKEN_VESTING_ABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor'
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
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'Paused',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'enum IPasarVesting.Allocations',
        name: 'alloc',
        type: 'uint8'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'recipient',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'Released',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'Unpaused',
    type: 'event'
  },
  {
    inputs: [],
    name: 'AIRDROP_ALLOC',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'LIQUIDITY_ALLOC',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'LIQUIDITY_INIT_ALLOC',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'LIQUIDITY_INIT_AMOUNT',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'MINING_ALLOC',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'PRESALE_ALLOC',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'RATE_BASE',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'RELEASE_UNIT',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'STAKING_ALLOC',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'TEAM_ALLOC',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'TOTAL_SUPPLY',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'TREASURY_ALLOC',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getCurrentTime',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'enum IPasarVesting.Allocations',
        name: 'alloc',
        type: 'uint8'
      }
    ],
    name: 'getReleaseByAlloc',
    outputs: [
      {
        internalType: 'uint256',
        name: 'total',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'released',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'releasable',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'name',
        type: 'string'
      }
    ],
    name: 'getReleaseByName',
    outputs: [
      {
        internalType: 'uint256',
        name: 'total',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'released',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'releasable',
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
        name: 'operator',
        type: 'address'
      }
    ],
    name: 'getReleaseByOperator',
    outputs: [
      {
        internalType: 'uint256',
        name: 'total',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'released',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'releasable',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'enum IPasarVesting.Allocations',
        name: 'alloc',
        type: 'uint8'
      }
    ],
    name: 'getScheduleByAlloc',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'operator',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'startTime',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'allocRatio',
            type: 'uint256'
          },
          {
            internalType: 'uint256[]',
            name: 'ratios',
            type: 'uint256[]'
          },
          {
            internalType: 'uint256[]',
            name: 'amounts',
            type: 'uint256[]'
          },
          {
            internalType: 'uint256[]',
            name: 'accAmounts',
            type: 'uint256[]'
          }
        ],
        internalType: 'struct IPasarVesting.VestingConfig',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'name',
        type: 'string'
      }
    ],
    name: 'getScheduleByName',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'operator',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'startTime',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'allocRatio',
            type: 'uint256'
          },
          {
            internalType: 'uint256[]',
            name: 'ratios',
            type: 'uint256[]'
          },
          {
            internalType: 'uint256[]',
            name: 'amounts',
            type: 'uint256[]'
          },
          {
            internalType: 'uint256[]',
            name: 'accAmounts',
            type: 'uint256[]'
          }
        ],
        internalType: 'struct IPasarVesting.VestingConfig',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token_',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'mining',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'treasury',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'team',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'staking',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'airdrop',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'liquidity',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'presale',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'airdropStartTime',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'presaleStartTime',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'vestingStartTime',
        type: 'uint256'
      }
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    name: 'names',
    outputs: [
      {
        internalType: 'enum IPasarVesting.Allocations',
        name: '',
        type: 'uint8'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    name: 'operators',
    outputs: [
      {
        internalType: 'enum IPasarVesting.Allocations',
        name: '',
        type: 'uint8'
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
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'paused',
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
        internalType: 'enum IPasarVesting.Allocations',
        name: 'alloc',
        type: 'uint8'
      },
      {
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256'
      }
    ],
    name: 'releaseAtTimeByAlloc',
    outputs: [
      {
        internalType: 'uint256',
        name: 'total',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'name',
        type: 'string'
      },
      {
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256'
      }
    ],
    name: 'releaseAtTimeByName',
    outputs: [
      {
        internalType: 'uint256',
        name: 'total',
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
        name: 'recipient',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'releaseTo',
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
        name: 'mining',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'treasury',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'team',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'staking',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'airdrop',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'liquidity',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'presale',
        type: 'address'
      }
    ],
    name: 'setOperators',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'token',
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
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
];
