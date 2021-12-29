import { subDays, differenceInDays  } from 'date-fns';

// Get Abbrevation of hex addres //
export const reduceHexAddress = strAddress => strAddress?`${strAddress.substring(0, 5)}...${strAddress.substring(strAddress.length - 3, strAddress.length)}`:'';

// Get time from timestamp //
export const getTime = timestamp => {
  const date = new Date(timestamp * 1000);
  const pieces = date.toUTCString().split(" ");
  const [wd, d, m, y] = pieces;
  const dateStr = [m, d, y].join("-");

  let hours = date.getUTCHours();
  const suffix = hours >= 12 ? "PM":"AM";
  hours = hours > 12 ? hours - 12 : hours;
  hours = hours.toString().padStart(2,'0');
  const min = date.getUTCMinutes().toString().padStart(2,'0');
  const sec = date.getUTCSeconds().toString().padStart(2,'0');
  const timeStr = [hours, min, sec].join(':').concat(" ").concat([suffix, "+UTC"].join(' '));
  return {'date':dateStr, 'time':timeStr};
};
// Get thumbnail url //
export const getThumbnail = id => {
  if(id===undefined)
    return "";
  return `https://ipfs0.trinity-feeds.app/ipfs/${id.substring(12, id.length)}`;
}
  

export const getElapsedTime = createdtimestamp => {
  const currentTimestamp = new Date().getTime() / 1000;
  const timestamp = currentTimestamp - createdtimestamp;
  let strDate = '';
  const nDay = parseInt(timestamp / (24 * 3600), 10);
  const nHour = parseInt(timestamp/ 3600, 10) % 24;
  const nMin = parseInt(timestamp / 60, 10) % 60;
  if (nDay > 0) strDate += nDay.concat('d');
  else if (nHour > 0) strDate += ' '.concat(nHour).concat('h');
  else if (nMin > 0) strDate += ' '.concat(nMin).concat('m');
  if (strDate === '') strDate = '0m';
  strDate += ' ago';
  return strDate;
};


export function dateRangeBeforeDays(days) {
  return [...Array(days).keys()].map((i) => subDays(new Date(), i).toISOString().slice(0, 10));
}

export const MethodList = [
  {
    method: 'Mint', 
    color: '#C4C4C4', 
    icon: 'hammer', 
    detail: [
      {description: 'New collectible created', field: null, copyable: false},
      {description: 'By', field: 'to', copyable: true, ellipsis: true},
    ]
  },
  {
    method: 'SafeTransferFromWithMemo', 
    color: '#2B86DA', 
    icon: 'exchange', 
    detail: [
      {description: 'Collectible transferred to', field: 'to', copyable: true, ellipsis: true},
      {description: 'By', field: 'from', copyable: true, ellipsis: true},
    ]
  },
  {
    method: 'SafeTransferFrom', 
    color: '#789AB9', 
    icon: 'exchange', 
    detail: [
      {description: 'Collectible transferred to', field: 'to', copyable: true, ellipsis: true},
      {description: 'By', field: 'from', copyable: true, ellipsis: true},
    ]
  },
  {
    method: 'SetApprovalForAll', 
    color: '#17E9C3', 
    icon: 'stamp', 
    detail: [
      {description: 'Marketplace contract approved →', field: 'to', copyable: true, ellipsis: true},
      {description: 'By', field: 'from', copyable: true, ellipsis: true},
    ]
  },
  {
    method: 'Burn', 
    color: '#E96317', 
    icon: 'trashcan', 
    detail: [
      {description: 'Collectible deleted from contract', field: 'to', copyable: true, ellipsis: true},
      {description: 'By', field: 'from', copyable: true, ellipsis: true},
    ]
  },
  {
    method: 'CreateOrderForSale', 
    color: '#5B25CD', 
    icon: 'marketplace', 
    detail: [
      {description: 'Collectible listed on marketplace →', field: 'to', copyable: true, ellipsis: true},
      {description: 'By', field: 'from', copyable: true, ellipsis: true},
      {description: 'For a value of', field: 'price', copyable: false},
    ]
  },
  {
    method: 'BuyOrder', 
    color: '#25CD7C', 
    icon: 'basket', 
    detail: [
      {description: 'Collectible purchased from', field: 'from', copyable: true, ellipsis: true},
      {description: 'By', field: 'to', copyable: true, ellipsis: true},
      {description: 'For a value of', field: 'price', copyable: false},
      {description: 'With a total tx fee of', field: 'totalfee', copyable: false},
    ]
  },
  {
    method: 'CancelOrder', 
    color: '#D60000', 
    icon: 'remove', 
    detail: [
      {description: 'Collectible removed from marketplace →', field: 'from', copyable: true, ellipsis: true},
      {description: 'By', field: 'to', copyable: true, ellipsis: true},
    ]
  },
  {
    method: 'ChangeOrderPrice', 
    color: '#CD6B25', 
    icon: 'tag', 
    detail: [
      {description: 'Collectible value updated to', field: 'data.new', copyable: false},
      {description: 'By', field: 'from', copyable: true, ellipsis: true},
      {description: 'From initial value of', field: 'data.old', copyable: false},
    ]
  }
]