import React from 'react';
import { Box, Stack, Card, Divider } from '@mui/material';

import { MHidden } from '../@material-extend';
import { TransItem } from '../explorer/CollectionView/LatestTransactions';
import TransSkeleton from './TransSkeleton';
import { fetchFrom } from '../../utils/common';
// ----------------------------------------------------------------------
export default function FilteredTransGrid() {
  const [transactions, setFilteredTrans] = React.useState([]);
  const [isLoadingTrans, setLoadingTrans] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoadingTrans(true);
      fetchFrom(`api/v2/sticker/listTrans?pageNum=1&pageSize=10`)
        .then((response) => {
          response
            .json()
            .then((jsonTrans) => {
              if (jsonTrans.data) {
                setFilteredTrans(jsonTrans.data.results);
              }
              setLoadingTrans(false);
            })
            .catch((e) => {
              console.error(e);
              setLoadingTrans(false);
            });
        })
        .catch((e) => {
          if (e.code !== e.ABORT_ERR) setLoadingTrans(false);
        });
    };
    fetchData();
  }, []);
  const loadingSkeletons = Array(5).fill(null);
  return (
    <Stack direction="row" spacing={2}>
      <Card sx={{ flexGrow: 1 }}>
        <Stack spacing={2} sx={{ p: 3 }}>
          {isLoadingTrans
            ? loadingSkeletons.map((_, index) => (
                <Box key={index}>
                  <TransSkeleton />
                  {index < loadingSkeletons.length - 1 && <Divider sx={{ pb: 2 }} />}
                </Box>
              ))
            : transactions.slice(0, 5).map((trans, index) => (
                <Box key={index}>
                  <TransItem trans={trans} />
                  {index < transactions.slice(0, 5).length - 1 && <Divider sx={{ pb: 2 }} />}
                </Box>
              ))}
        </Stack>
      </Card>
      <MHidden width="mdDown">
        {(isLoadingTrans || (!isLoadingTrans && transactions.length > 5)) && (
          <Card sx={{ flexGrow: 1 }}>
            <Stack spacing={2} sx={{ p: 3 }}>
              {isLoadingTrans
                ? loadingSkeletons.map((_, index) => (
                    <Box key={index}>
                      <TransSkeleton />
                      {index < loadingSkeletons.length - 1 && <Divider sx={{ pb: 2 }} />}
                    </Box>
                  ))
                : transactions.slice(5, 10).map((trans, index) => (
                    <Box key={index}>
                      <TransItem trans={trans} />
                      {index < transactions.slice(5, 10).length - 1 && <Divider sx={{ pb: 2 }} />}
                    </Box>
                  ))}
            </Stack>
          </Card>
        )}
      </MHidden>
    </Stack>
  );
}
