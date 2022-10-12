module.exports.TOKEN_STAKING_ABI = [
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
        name: 'user',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'prevAmount',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'currentReward',
        type: 'uint256'
      }
    ],
    name: 'Staked',
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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'fee',
        type: 'uint256'
      }
    ],
    name: 'Withdrawn',
    type: 'event'
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
    name: 'SHARE_BASE',
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
    inputs: [],
    name: 'config',
    outputs: [
      {
        internalType: 'address',
        name: 'stakeToken',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'boostToken',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'vesting',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'platform',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'feePeriod',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'feeRate',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'boostRequired',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'boostRate',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
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
    inputs: [],
    name: 'getPoolInfo',
    outputs: [
      {
        internalType: 'uint256',
        name: 'currentStaked',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'totalReward',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'totalWithdrawn',
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
        name: 'user',
        type: 'address'
      }
    ],
    name: 'getUserInfo',
    outputs: [
      {
        internalType: 'uint256',
        name: 'currentStaked',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'rewardWithdrawable',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'rewardWithdrawn',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'rewardFeePaid',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'feeEndTime',
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
        name: 'stakeToken',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'boostToken',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'vesting',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'platform',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'feePeriod',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'feeRate',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'boostRequired',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'boostRate',
        type: 'uint256'
      }
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
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
    inputs: [],
    name: 'pool',
    outputs: [
      {
        internalType: 'uint256',
        name: 'lastRewardBlock',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'accRewardPerShare',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'totalShares',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'currentStaked',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'rewardSettled',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'rewardWithdrawn',
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
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'stake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256'
      }
    ],
    name: 'totalRewardAtTime',
    outputs: [
      {
        internalType: 'uint256',
        name: 'totalReward',
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
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    name: 'userAddrs',
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
    name: 'userCount',
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
        name: '',
        type: 'address'
      }
    ],
    name: 'users',
    outputs: [
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: 'userAddr',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'currentStaked',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'feeEndTime',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'shares',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'rewardDebt',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'rewardSettled',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'rewardWithdrawn',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'rewardFee',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
];
