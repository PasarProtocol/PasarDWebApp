module.exports.PASAR_CONTRACT_ABI = [
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
        name: '_operator',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_from',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: '_ids',
        type: 'uint256[]'
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: '_values',
        type: 'uint256[]'
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: '_data',
        type: 'bytes'
      }
    ],
    name: 'ERC1155BatchReceived',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_operator',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_from',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: '_id',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_value',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: '_data',
        type: 'bytes'
      }
    ],
    name: 'ERC1155Received',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_operator',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_from',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_tokenAddress',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: '_data',
        type: 'bytes'
      }
    ],
    name: 'ERC721TokenReceived',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_libraryAddress',
        type: 'address'
      }
    ],
    name: 'LibraryContract',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_seller',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_buyer',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: '_orderId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_price',
        type: 'uint256'
      }
    ],
    name: 'OrderBid',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_seller',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: '_orderId',
        type: 'uint256'
      }
    ],
    name: 'OrderCanceled',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: '_sellerUri',
        type: 'string'
      },
      {
        indexed: false,
        internalType: 'string',
        name: '_buyerUri',
        type: 'string'
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_seller',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_buyer',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: '_orderId',
        type: 'uint256'
      }
    ],
    name: 'OrderDIDURI',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: '_platformAddress',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_platformFee',
        type: 'uint256'
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
        name: '_royaltyFees',
        type: 'uint256[]'
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_seller',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_buyer',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: '_orderId',
        type: 'uint256'
      }
    ],
    name: 'OrderFees',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: '_seller',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_buyer',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: '_orderId',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_baseToken',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_quoteToken',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_price',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_royaltyFee',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_platformFee',
        type: 'uint256'
      }
    ],
    name: 'OrderFilled',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: '_seller',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: '_orderId',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_baseToken',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_quoteToken',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_minPrice',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_reservePrice',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_buyoutPrice',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_startTime',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_endTime',
        type: 'uint256'
      }
    ],
    name: 'OrderForAuction',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: '_seller',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: '_orderId',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_baseToken',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_quoteToken',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_price',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_startTime',
        type: 'uint256'
      }
    ],
    name: 'OrderForSale',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_seller',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: '_orderId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_oldPrice',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_newPrice',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_oldReservePrice',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_newReservePrice',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_oldBuyoutPrice',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_newBuyoutPrice',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_oldQuoteToken',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_newQuoteToken',
        type: 'address'
      }
    ],
    name: 'OrderPriceChanged',
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
    inputs: [
      {
        internalType: 'uint256',
        name: '_orderId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_value',
        type: 'uint256'
      },
      {
        internalType: 'string',
        name: '_didUri',
        type: 'string'
      }
    ],
    name: 'bidForOrder',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_orderId',
        type: 'uint256'
      },
      {
        internalType: 'string',
        name: '_didUri',
        type: 'string'
      }
    ],
    name: 'buyOrder',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_buyer',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_orderId',
        type: 'uint256'
      },
      {
        internalType: 'string',
        name: '_didUri',
        type: 'string'
      }
    ],
    name: 'buyOrderViaSwapper',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_orderId',
        type: 'uint256'
      }
    ],
    name: 'cancelOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_orderId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_price',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_reservePrice',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_buyoutPrice',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: '_quoteToken',
        type: 'address'
      }
    ],
    name: 'changeAuctionOrderPrice',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_orderId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_price',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: '_quoteToken',
        type: 'address'
      }
    ],
    name: 'changeSaleOrderPrice',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_baseToken',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: '_quoteToken',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_minPrice',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_reservePrice',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_buyoutPrice',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_startTime',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_endTime',
        type: 'uint256'
      },
      {
        internalType: 'string',
        name: '_didUri',
        type: 'string'
      }
    ],
    name: 'createOrderForAuction',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_baseToken',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: '_quoteToken',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_price',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_startTime',
        type: 'uint256'
      },
      {
        internalType: 'string',
        name: '_didUri',
        type: 'string'
      }
    ],
    name: 'createOrderForSale',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_baseToken',
        type: 'address'
      },
      {
        internalType: 'uint256[]',
        name: '_tokenIds',
        type: 'uint256[]'
      },
      {
        internalType: 'uint256[]',
        name: '_amounts',
        type: 'uint256[]'
      },
      {
        internalType: 'address',
        name: '_quoteToken',
        type: 'address'
      },
      {
        internalType: 'uint256[]',
        name: '_prices',
        type: 'uint256[]'
      },
      {
        internalType: 'uint256[]',
        name: '_startTimes',
        type: 'uint256[]'
      },
      {
        internalType: 'string',
        name: '_didUri',
        type: 'string'
      }
    ],
    name: 'createOrderForSaleBatch',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_buyer',
        type: 'address'
      }
    ],
    name: 'getBuyerByAddr',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'index',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'buyerAddr',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'orderCount',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'filledCount',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'joinTime',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'lastActionTime',
            type: 'uint256'
          }
        ],
        internalType: 'struct IPasarV2DataAndEvents.BuyerInfo',
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
        internalType: 'uint256',
        name: '_index',
        type: 'uint256'
      }
    ],
    name: 'getBuyerByIndex',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'index',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'buyerAddr',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'orderCount',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'filledCount',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'joinTime',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'lastActionTime',
            type: 'uint256'
          }
        ],
        internalType: 'struct IPasarV2DataAndEvents.BuyerInfo',
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
        internalType: 'uint256[]',
        name: '_indexes',
        type: 'uint256[]'
      }
    ],
    name: 'getBuyerByIndexBatch',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'index',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'buyerAddr',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'orderCount',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'filledCount',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'joinTime',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'lastActionTime',
            type: 'uint256'
          }
        ],
        internalType: 'struct IPasarV2DataAndEvents.BuyerInfo[]',
        name: '',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getBuyerCount',
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
        name: '_buyer',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_quoteToken',
        type: 'address'
      }
    ],
    name: 'getBuyerFeeInfo',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'paid',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'royalty',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'platformFee',
            type: 'uint256'
          }
        ],
        internalType: 'struct IPasarV2DataAndEvents.BuyerFeeInfo',
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
        name: '_buyer',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_index',
        type: 'uint256'
      }
    ],
    name: 'getBuyerFilledByIndex',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'orderId',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'orderType',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'orderState',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'baseToken',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256'
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
          },
          {
            internalType: 'uint256',
            name: 'price',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'reservePrice',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'buyoutPrice',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'startTime',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'endTime',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'sellerAddr',
            type: 'address'
          },
          {
            internalType: 'address',
            name: 'buyerAddr',
            type: 'address'
          },
          {
            internalType: 'string',
            name: 'sellerUri',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'buyerUri',
            type: 'string'
          },
          {
            internalType: 'uint256',
            name: 'bids',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'lastBidder',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'lastBid',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'filled',
            type: 'uint256'
          },
          {
            internalType: 'address[]',
            name: 'royaltyOwners',
            type: 'address[]'
          },
          {
            internalType: 'uint256[]',
            name: 'royaltyFees',
            type: 'uint256[]'
          },
          {
            internalType: 'uint256',
            name: 'royaltyFeeTotal',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'platformAddr',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'platformFee',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'createTime',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'updateTime',
            type: 'uint256'
          }
        ],
        internalType: 'struct IPasarV2DataAndEvents.OrderInfo',
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
        name: '_buyer',
        type: 'address'
      },
      {
        internalType: 'uint256[]',
        name: '_indexes',
        type: 'uint256[]'
      }
    ],
    name: 'getBuyerFilledByIndexBatch',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'orderId',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'orderType',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'orderState',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'baseToken',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256'
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
          },
          {
            internalType: 'uint256',
            name: 'price',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'reservePrice',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'buyoutPrice',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'startTime',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'endTime',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'sellerAddr',
            type: 'address'
          },
          {
            internalType: 'address',
            name: 'buyerAddr',
            type: 'address'
          },
          {
            internalType: 'string',
            name: 'sellerUri',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'buyerUri',
            type: 'string'
          },
          {
            internalType: 'uint256',
            name: 'bids',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'lastBidder',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'lastBid',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'filled',
            type: 'uint256'
          },
          {
            internalType: 'address[]',
            name: 'royaltyOwners',
            type: 'address[]'
          },
          {
            internalType: 'uint256[]',
            name: 'royaltyFees',
            type: 'uint256[]'
          },
          {
            internalType: 'uint256',
            name: 'royaltyFeeTotal',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'platformAddr',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'platformFee',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'createTime',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'updateTime',
            type: 'uint256'
          }
        ],
        internalType: 'struct IPasarV2DataAndEvents.OrderInfo[]',
        name: '',
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
        name: '_buyer',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_index',
        type: 'uint256'
      }
    ],
    name: 'getBuyerOrderByIndex',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'orderId',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'orderType',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'orderState',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'baseToken',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256'
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
          },
          {
            internalType: 'uint256',
            name: 'price',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'reservePrice',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'buyoutPrice',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'startTime',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'endTime',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'sellerAddr',
            type: 'address'
          },
          {
            internalType: 'address',
            name: 'buyerAddr',
            type: 'address'
          },
          {
            internalType: 'string',
            name: 'sellerUri',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'buyerUri',
            type: 'string'
          },
          {
            internalType: 'uint256',
            name: 'bids',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'lastBidder',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'lastBid',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'filled',
            type: 'uint256'
          },
          {
            internalType: 'address[]',
            name: 'royaltyOwners',
            type: 'address[]'
          },
          {
            internalType: 'uint256[]',
            name: 'royaltyFees',
            type: 'uint256[]'
          },
          {
            internalType: 'uint256',
            name: 'royaltyFeeTotal',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'platformAddr',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'platformFee',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'createTime',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'updateTime',
            type: 'uint256'
          }
        ],
        internalType: 'struct IPasarV2DataAndEvents.OrderInfo',
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
        name: '_buyer',
        type: 'address'
      },
      {
        internalType: 'uint256[]',
        name: '_indexes',
        type: 'uint256[]'
      }
    ],
    name: 'getBuyerOrderByIndexBatch',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'orderId',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'orderType',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'orderState',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'baseToken',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256'
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
          },
          {
            internalType: 'uint256',
            name: 'price',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'reservePrice',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'buyoutPrice',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'startTime',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'endTime',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'sellerAddr',
            type: 'address'
          },
          {
            internalType: 'address',
            name: 'buyerAddr',
            type: 'address'
          },
          {
            internalType: 'string',
            name: 'sellerUri',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'buyerUri',
            type: 'string'
          },
          {
            internalType: 'uint256',
            name: 'bids',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'lastBidder',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'lastBid',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'filled',
            type: 'uint256'
          },
          {
            internalType: 'address[]',
            name: 'royaltyOwners',
            type: 'address[]'
          },
          {
            internalType: 'uint256[]',
            name: 'royaltyFees',
            type: 'uint256[]'
          },
          {
            internalType: 'uint256',
            name: 'royaltyFeeTotal',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'platformAddr',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'platformFee',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'createTime',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'updateTime',
            type: 'uint256'
          }
        ],
        internalType: 'struct IPasarV2DataAndEvents.OrderInfo[]',
        name: '',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
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
    name: 'getLibraryContract',
    outputs: [
      {
        internalType: 'address',
        name: '_libraryAddress',
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
    inputs: [
      {
        internalType: 'uint256',
        name: '_index',
        type: 'uint256'
      }
    ],
    name: 'getOpenOrderByIndex',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'orderId',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'orderType',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'orderState',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'baseToken',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256'
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
          },
          {
            internalType: 'uint256',
            name: 'price',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'reservePrice',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'buyoutPrice',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'startTime',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'endTime',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'sellerAddr',
            type: 'address'
          },
          {
            internalType: 'address',
            name: 'buyerAddr',
            type: 'address'
          },
          {
            internalType: 'string',
            name: 'sellerUri',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'buyerUri',
            type: 'string'
          },
          {
            internalType: 'uint256',
            name: 'bids',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'lastBidder',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'lastBid',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'filled',
            type: 'uint256'
          },
          {
            internalType: 'address[]',
            name: 'royaltyOwners',
            type: 'address[]'
          },
          {
            internalType: 'uint256[]',
            name: 'royaltyFees',
            type: 'uint256[]'
          },
          {
            internalType: 'uint256',
            name: 'royaltyFeeTotal',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'platformAddr',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'platformFee',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'createTime',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'updateTime',
            type: 'uint256'
          }
        ],
        internalType: 'struct IPasarV2DataAndEvents.OrderInfo',
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
        internalType: 'uint256[]',
        name: '_indexes',
        type: 'uint256[]'
      }
    ],
    name: 'getOpenOrderByIndexBatch',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'orderId',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'orderType',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'orderState',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'baseToken',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256'
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
          },
          {
            internalType: 'uint256',
            name: 'price',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'reservePrice',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'buyoutPrice',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'startTime',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'endTime',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'sellerAddr',
            type: 'address'
          },
          {
            internalType: 'address',
            name: 'buyerAddr',
            type: 'address'
          },
          {
            internalType: 'string',
            name: 'sellerUri',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'buyerUri',
            type: 'string'
          },
          {
            internalType: 'uint256',
            name: 'bids',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'lastBidder',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'lastBid',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'filled',
            type: 'uint256'
          },
          {
            internalType: 'address[]',
            name: 'royaltyOwners',
            type: 'address[]'
          },
          {
            internalType: 'uint256[]',
            name: 'royaltyFees',
            type: 'uint256[]'
          },
          {
            internalType: 'uint256',
            name: 'royaltyFeeTotal',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'platformAddr',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'platformFee',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'createTime',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'updateTime',
            type: 'uint256'
          }
        ],
        internalType: 'struct IPasarV2DataAndEvents.OrderInfo[]',
        name: '',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getOpenOrderCount',
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
        internalType: 'uint256',
        name: '_orderId',
        type: 'uint256'
      }
    ],
    name: 'getOrderById',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'orderId',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'orderType',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'orderState',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'baseToken',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256'
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
          },
          {
            internalType: 'uint256',
            name: 'price',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'reservePrice',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'buyoutPrice',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'startTime',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'endTime',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'sellerAddr',
            type: 'address'
          },
          {
            internalType: 'address',
            name: 'buyerAddr',
            type: 'address'
          },
          {
            internalType: 'string',
            name: 'sellerUri',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'buyerUri',
            type: 'string'
          },
          {
            internalType: 'uint256',
            name: 'bids',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'lastBidder',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'lastBid',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'filled',
            type: 'uint256'
          },
          {
            internalType: 'address[]',
            name: 'royaltyOwners',
            type: 'address[]'
          },
          {
            internalType: 'uint256[]',
            name: 'royaltyFees',
            type: 'uint256[]'
          },
          {
            internalType: 'uint256',
            name: 'royaltyFeeTotal',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'platformAddr',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'platformFee',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'createTime',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'updateTime',
            type: 'uint256'
          }
        ],
        internalType: 'struct IPasarV2DataAndEvents.OrderInfo',
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
        internalType: 'uint256[]',
        name: '_orderIds',
        type: 'uint256[]'
      }
    ],
    name: 'getOrderByIdBatch',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'orderId',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'orderType',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'orderState',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'baseToken',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256'
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
          },
          {
            internalType: 'uint256',
            name: 'price',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'reservePrice',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'buyoutPrice',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'startTime',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'endTime',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'sellerAddr',
            type: 'address'
          },
          {
            internalType: 'address',
            name: 'buyerAddr',
            type: 'address'
          },
          {
            internalType: 'string',
            name: 'sellerUri',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'buyerUri',
            type: 'string'
          },
          {
            internalType: 'uint256',
            name: 'bids',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'lastBidder',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'lastBid',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'filled',
            type: 'uint256'
          },
          {
            internalType: 'address[]',
            name: 'royaltyOwners',
            type: 'address[]'
          },
          {
            internalType: 'uint256[]',
            name: 'royaltyFees',
            type: 'uint256[]'
          },
          {
            internalType: 'uint256',
            name: 'royaltyFeeTotal',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'platformAddr',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'platformFee',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'createTime',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'updateTime',
            type: 'uint256'
          }
        ],
        internalType: 'struct IPasarV2DataAndEvents.OrderInfo[]',
        name: '',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getOrderCount',
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
    name: 'getPlatformFee',
    outputs: [
      {
        internalType: 'address',
        name: '_platformAddress',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_platformFeeRate',
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
        name: '_seller',
        type: 'address'
      }
    ],
    name: 'getSellerByAddr',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'index',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'sellerAddr',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'orderCount',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'openCount',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'joinTime',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'lastActionTime',
            type: 'uint256'
          }
        ],
        internalType: 'struct IPasarV2DataAndEvents.SellerInfo',
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
        internalType: 'uint256',
        name: '_index',
        type: 'uint256'
      }
    ],
    name: 'getSellerByIndex',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'index',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'sellerAddr',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'orderCount',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'openCount',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'joinTime',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'lastActionTime',
            type: 'uint256'
          }
        ],
        internalType: 'struct IPasarV2DataAndEvents.SellerInfo',
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
        internalType: 'uint256[]',
        name: '_indexes',
        type: 'uint256[]'
      }
    ],
    name: 'getSellerByIndexBatch',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'index',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'sellerAddr',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'orderCount',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'openCount',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'joinTime',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'lastActionTime',
            type: 'uint256'
          }
        ],
        internalType: 'struct IPasarV2DataAndEvents.SellerInfo[]',
        name: '',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getSellerCount',
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
        name: '_seller',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_quoteToken',
        type: 'address'
      }
    ],
    name: 'getSellerFeeInfo',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'earned',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'royalty',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'platformFee',
            type: 'uint256'
          }
        ],
        internalType: 'struct IPasarV2DataAndEvents.SellerFeeInfo',
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
        name: '_seller',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_index',
        type: 'uint256'
      }
    ],
    name: 'getSellerOpenByIndex',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'orderId',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'orderType',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'orderState',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'baseToken',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256'
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
          },
          {
            internalType: 'uint256',
            name: 'price',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'reservePrice',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'buyoutPrice',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'startTime',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'endTime',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'sellerAddr',
            type: 'address'
          },
          {
            internalType: 'address',
            name: 'buyerAddr',
            type: 'address'
          },
          {
            internalType: 'string',
            name: 'sellerUri',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'buyerUri',
            type: 'string'
          },
          {
            internalType: 'uint256',
            name: 'bids',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'lastBidder',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'lastBid',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'filled',
            type: 'uint256'
          },
          {
            internalType: 'address[]',
            name: 'royaltyOwners',
            type: 'address[]'
          },
          {
            internalType: 'uint256[]',
            name: 'royaltyFees',
            type: 'uint256[]'
          },
          {
            internalType: 'uint256',
            name: 'royaltyFeeTotal',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'platformAddr',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'platformFee',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'createTime',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'updateTime',
            type: 'uint256'
          }
        ],
        internalType: 'struct IPasarV2DataAndEvents.OrderInfo',
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
        name: '_seller',
        type: 'address'
      },
      {
        internalType: 'uint256[]',
        name: '_indexes',
        type: 'uint256[]'
      }
    ],
    name: 'getSellerOpenByIndexBatch',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'orderId',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'orderType',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'orderState',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'baseToken',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256'
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
          },
          {
            internalType: 'uint256',
            name: 'price',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'reservePrice',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'buyoutPrice',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'startTime',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'endTime',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'sellerAddr',
            type: 'address'
          },
          {
            internalType: 'address',
            name: 'buyerAddr',
            type: 'address'
          },
          {
            internalType: 'string',
            name: 'sellerUri',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'buyerUri',
            type: 'string'
          },
          {
            internalType: 'uint256',
            name: 'bids',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'lastBidder',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'lastBid',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'filled',
            type: 'uint256'
          },
          {
            internalType: 'address[]',
            name: 'royaltyOwners',
            type: 'address[]'
          },
          {
            internalType: 'uint256[]',
            name: 'royaltyFees',
            type: 'uint256[]'
          },
          {
            internalType: 'uint256',
            name: 'royaltyFeeTotal',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'platformAddr',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'platformFee',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'createTime',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'updateTime',
            type: 'uint256'
          }
        ],
        internalType: 'struct IPasarV2DataAndEvents.OrderInfo[]',
        name: '',
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
        name: '_seller',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_index',
        type: 'uint256'
      }
    ],
    name: 'getSellerOrderByIndex',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'orderId',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'orderType',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'orderState',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'baseToken',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256'
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
          },
          {
            internalType: 'uint256',
            name: 'price',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'reservePrice',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'buyoutPrice',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'startTime',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'endTime',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'sellerAddr',
            type: 'address'
          },
          {
            internalType: 'address',
            name: 'buyerAddr',
            type: 'address'
          },
          {
            internalType: 'string',
            name: 'sellerUri',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'buyerUri',
            type: 'string'
          },
          {
            internalType: 'uint256',
            name: 'bids',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'lastBidder',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'lastBid',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'filled',
            type: 'uint256'
          },
          {
            internalType: 'address[]',
            name: 'royaltyOwners',
            type: 'address[]'
          },
          {
            internalType: 'uint256[]',
            name: 'royaltyFees',
            type: 'uint256[]'
          },
          {
            internalType: 'uint256',
            name: 'royaltyFeeTotal',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'platformAddr',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'platformFee',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'createTime',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'updateTime',
            type: 'uint256'
          }
        ],
        internalType: 'struct IPasarV2DataAndEvents.OrderInfo',
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
        name: '_seller',
        type: 'address'
      },
      {
        internalType: 'uint256[]',
        name: '_indexes',
        type: 'uint256[]'
      }
    ],
    name: 'getSellerOrderByIndexBatch',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'orderId',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'orderType',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'orderState',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'baseToken',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256'
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
          },
          {
            internalType: 'uint256',
            name: 'price',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'reservePrice',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'buyoutPrice',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'startTime',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'endTime',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'sellerAddr',
            type: 'address'
          },
          {
            internalType: 'address',
            name: 'buyerAddr',
            type: 'address'
          },
          {
            internalType: 'string',
            name: 'sellerUri',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'buyerUri',
            type: 'string'
          },
          {
            internalType: 'uint256',
            name: 'bids',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'lastBidder',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'lastBid',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'filled',
            type: 'uint256'
          },
          {
            internalType: 'address[]',
            name: 'royaltyOwners',
            type: 'address[]'
          },
          {
            internalType: 'uint256[]',
            name: 'royaltyFees',
            type: 'uint256[]'
          },
          {
            internalType: 'uint256',
            name: 'royaltyFeeTotal',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'platformAddr',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'platformFee',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'createTime',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'updateTime',
            type: 'uint256'
          }
        ],
        internalType: 'struct IPasarV2DataAndEvents.OrderInfo[]',
        name: '',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
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
    inputs: [],
    name: 'initialize',
    outputs: [],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_library',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_registry',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_dexSwapper',
        type: 'address'
      }
    ],
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
        name: '_operator',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_from',
        type: 'address'
      },
      {
        internalType: 'uint256[]',
        name: '_ids',
        type: 'uint256[]'
      },
      {
        internalType: 'uint256[]',
        name: '_values',
        type: 'uint256[]'
      },
      {
        internalType: 'bytes',
        name: '_data',
        type: 'bytes'
      }
    ],
    name: 'onERC1155BatchReceived',
    outputs: [
      {
        internalType: 'bytes4',
        name: '',
        type: 'bytes4'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_operator',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_from',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_id',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_value',
        type: 'uint256'
      },
      {
        internalType: 'bytes',
        name: '_data',
        type: 'bytes'
      }
    ],
    name: 'onERC1155Received',
    outputs: [
      {
        internalType: 'bytes4',
        name: '',
        type: 'bytes4'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_operator',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_from',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256'
      },
      {
        internalType: 'bytes',
        name: '_data',
        type: 'bytes'
      }
    ],
    name: 'onERC721Received',
    outputs: [
      {
        internalType: 'bytes4',
        name: '',
        type: 'bytes4'
      }
    ],
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
    name: 'pasarRegistry',
    outputs: [
      {
        internalType: 'address',
        name: '_registry',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'pasarSwapper',
    outputs: [
      {
        internalType: 'address',
        name: '_swapper',
        type: 'address'
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
        name: '_libraryAddress',
        type: 'address'
      }
    ],
    name: 'setLibraryContract',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_platformAddress',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_platformFeeRate',
        type: 'uint256'
      }
    ],
    name: 'setPlatformFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_dexSwapper',
        type: 'address'
      }
    ],
    name: 'setSwapper',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_orderId',
        type: 'uint256'
      }
    ],
    name: 'settleAuctionOrder',
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
  }
];
