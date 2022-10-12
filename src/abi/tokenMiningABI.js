module.exports.TOKEN_MINING_ABI = [
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
        name: 'market',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'bool',
        name: 'state',
        type: 'bool'
      }
    ],
    name: 'MarketSet',
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
        internalType: 'enum IPasarMiningDataAndEvents.RewardTypes',
        name: 'rewardType',
        type: 'uint8'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'RewardWithdrawn',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'enum IPasarMiningDataAndEvents.PoolTypes',
        name: 'pool',
        type: 'uint8'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'market',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'buyer',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'seller',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'creator',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'RewardsDistribution',
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
    name: 'BUYER_SHARE',
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
    name: 'CREATOR_SHARE',
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
    name: 'SELLER_SHARE',
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
    name: 'VESTING_NAME',
    outputs: [
      {
        internalType: 'string',
        name: '',
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
        name: '',
        type: 'address'
      },
      {
        internalType: 'enum IPasarMiningDataAndEvents.RewardTypes',
        name: '',
        type: 'uint8'
      }
    ],
    name: 'accRewards',
    outputs: [
      {
        internalType: 'uint256',
        name: 'total',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'withdrawn',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'withdrawable',
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
        name: 'account',
        type: 'address'
      }
    ],
    name: 'accountRewards',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'total',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'withdrawn',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'withdrawable',
            type: 'uint256'
          }
        ],
        internalType: 'struct IPasarMiningDataAndEvents.AccRewardInfo',
        name: 'all',
        type: 'tuple'
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'total',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'withdrawn',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'withdrawable',
            type: 'uint256'
          }
        ],
        internalType: 'struct IPasarMiningDataAndEvents.AccRewardInfo',
        name: 'buyer',
        type: 'tuple'
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'total',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'withdrawn',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'withdrawable',
            type: 'uint256'
          }
        ],
        internalType: 'struct IPasarMiningDataAndEvents.AccRewardInfo',
        name: 'seller',
        type: 'tuple'
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'total',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'withdrawn',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'withdrawable',
            type: 'uint256'
          }
        ],
        internalType: 'struct IPasarMiningDataAndEvents.AccRewardInfo',
        name: 'creator',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'enum IPasarMiningDataAndEvents.PoolTypes',
        name: '',
        type: 'uint8'
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    name: 'blockReward',
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
        internalType: 'enum IPasarMiningDataAndEvents.PoolTypes',
        name: '',
        type: 'uint8'
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    name: 'blockShares',
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
    name: 'config',
    outputs: [
      {
        internalType: 'address',
        name: 'ecoToken',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'nativeRatio',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'pasarRatio',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'ecoRatio',
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
        name: 'buyer',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'seller',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'creator',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: 'quoteToken',
        type: 'address'
      }
    ],
    name: 'distributeRewards',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getCurrentBlock',
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
    name: 'getCurrentRatios',
    outputs: [
      {
        internalType: 'uint256',
        name: 'native',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'pasar',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'eco',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'other',
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
        internalType: 'address',
        name: 'pasarToken_',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'vesting_',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'ecoToken',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'nativeRatio',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'pasarRatio',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'ecoRatio',
        type: 'uint256'
      },
      {
        internalType: 'address[]',
        name: 'markets',
        type: 'address[]'
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
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    name: 'isMarket',
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
    inputs: [],
    name: 'lastRewardBlock',
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
    name: 'lastRewardTotal',
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
        internalType: 'enum IPasarMiningDataAndEvents.PoolTypes',
        name: '',
        type: 'uint8'
      }
    ],
    name: 'lastSettledBlock',
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
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    name: 'names',
    outputs: [
      {
        internalType: 'enum IPasarMiningDataAndEvents.RewardTypes',
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
    name: 'pasarToken',
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
        internalType: 'address',
        name: '',
        type: 'address'
      },
      {
        internalType: 'enum IPasarMiningDataAndEvents.PoolTypes',
        name: '',
        type: 'uint8'
      },
      {
        internalType: 'enum IPasarMiningDataAndEvents.RewardTypes',
        name: '',
        type: 'uint8'
      }
    ],
    name: 'pendingBlocks',
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
    name: 'pendingRewards',
    outputs: [
      {
        internalType: 'uint256',
        name: 'total',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'native',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'pasar',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'eco',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'other',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
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
        name: 'account',
        type: 'address'
      }
    ],
    name: 'rewardCount',
    outputs: [
      {
        internalType: 'uint256',
        name: 'count',
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
        name: 'account',
        type: 'address'
      },
      {
        internalType: 'uint256[]',
        name: 'indexes',
        type: 'uint256[]'
      }
    ],
    name: 'rewardRecords',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'blockNumber',
            type: 'uint256'
          },
          {
            internalType: 'enum IPasarMiningDataAndEvents.RewardTypes',
            name: 'rewardType',
            type: 'uint8'
          },
          {
            internalType: 'uint256',
            name: 'rewardAmount',
            type: 'uint256'
          }
        ],
        internalType: 'struct IPasarMiningDataAndEvents.RewardInfo[]',
        name: 'records',
        type: 'tuple[]'
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
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    name: 'rewards',
    outputs: [
      {
        internalType: 'uint256',
        name: 'blockNumber',
        type: 'uint256'
      },
      {
        internalType: 'enum IPasarMiningDataAndEvents.RewardTypes',
        name: 'rewardType',
        type: 'uint8'
      },
      {
        internalType: 'uint256',
        name: 'rewardAmount',
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
        name: 'market',
        type: 'address'
      },
      {
        internalType: 'bool',
        name: 'state',
        type: 'bool'
      }
    ],
    name: 'setMarket',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'ecoToken',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'nativeRatio',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'pasarRatio',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'ecoRatio',
        type: 'uint256'
      }
    ],
    name: 'setRewardConfig',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      },
      {
        internalType: 'enum IPasarMiningDataAndEvents.PoolTypes',
        name: '',
        type: 'uint8'
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      },
      {
        internalType: 'enum IPasarMiningDataAndEvents.RewardTypes',
        name: '',
        type: 'uint8'
      }
    ],
    name: 'shares',
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
  },
  {
    inputs: [],
    name: 'vesting',
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
        internalType: 'string',
        name: 'name',
        type: 'string'
      }
    ],
    name: 'withdrawRewardByName',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'enum IPasarMiningDataAndEvents.RewardTypes',
        name: 'rewardType',
        type: 'uint8'
      }
    ],
    name: 'withdrawRewardByType',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
];
