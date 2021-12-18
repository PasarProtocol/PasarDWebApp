import { useState } from 'react';
// material
import SendIcon from '@mui/icons-material/Send';
import WorkIcon from '@mui/icons-material/Work';
import WifiIcon from '@mui/icons-material/Wifi';
import InboxIcon from '@mui/icons-material/Inbox';
import ImageIcon from '@mui/icons-material/Image';
import DraftsIcon from '@mui/icons-material/Drafts';
import CommentIcon from '@mui/icons-material/Comment';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import BluetoothIcon from '@mui/icons-material/Bluetooth';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import { styled } from '@mui/material/styles';
import {
  Box,
  Grid,
  List,
  Paper,
  Avatar,
  Switch,
  Divider,
  ListItem,
  Collapse,
  Checkbox,
  Container,
  IconButton,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  ListSubheader,
  ListItemAvatar,
  ListItemSecondaryAction
} from '@mui/material';
// routes
import { PATH_PAGE } from '../../../routes/paths';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
//
import { Block } from '../Block';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  paddingTop: theme.spacing(11),
  paddingBottom: theme.spacing(15)
}));

const ListWrapperStyle = styled(Paper)(({ theme }) => ({
  width: '100%',
  border: `solid 1px ${theme.palette.divider}`
}));

// ----------------------------------------------------------------------

function ListItemLink(props) {
  return <ListItemButton component="a" {...props} />;
}

export default function ListsComponent() {
  const [open, setOpen] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [checked, setChecked] = useState([0]);
  const [toggle, setToggle] = useState(['wifi']);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const handleCheck = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const handleToggle = (value) => () => {
    const currentIndex = toggle.indexOf(value);
    const newChecked = [...toggle];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setToggle(newChecked);
  };

  return (
    <RootStyle title="Components: Lists | Minimal-UI">
      <Box
        sx={{
          pt: 6,
          pb: 1,
          mb: 10,
          bgcolor: (theme) => (theme.palette.mode === 'light' ? 'grey.200' : 'grey.800')
        }}
      >
        <Container maxWidth="lg">
          <HeaderBreadcrumbs
            heading="Lists"
            links={[{ name: 'Components', href: PATH_PAGE.components }, { name: 'Lists' }]}
            moreLink="https://mui.com/components/lists"
          />
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Block title="Simple">
              <ListWrapperStyle>
                <List component="nav" aria-label="main mailbox folders">
                  <ListItemButton>
                    <ListItemIcon>
                      <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary="Inbox" />
                  </ListItemButton>
                  <ListItemButton>
                    <ListItemIcon>
                      <DraftsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Drafts" />
                  </ListItemButton>
                </List>

                <Divider />

                <List component="nav" aria-label="secondary mailbox folders">
                  <ListItemButton>
                    <ListItemText primary="Trash" />
                  </ListItemButton>
                  <ListItemLink href="#simple-list">
                    <ListItemText primary="Spam" />
                  </ListItemLink>
                </List>
              </ListWrapperStyle>
            </Block>
          </Grid>

          <Grid item xs={12} md={6}>
            <Block title="Nested">
              <ListWrapperStyle>
                <List
                  component="nav"
                  aria-labelledby="nested-list-subheader"
                  subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                      Nested List Items
                    </ListSubheader>
                  }
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <SendIcon />
                    </ListItemIcon>
                    <ListItemText primary="Sent mail" />
                  </ListItemButton>
                  <ListItemButton>
                    <ListItemIcon>
                      <DraftsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Drafts" />
                  </ListItemButton>
                  <ListItemButton onClick={handleClick}>
                    <ListItemIcon>
                      <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary="Inbox" />
                    {open ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          <StarBorder />
                        </ListItemIcon>
                        <ListItemText primary="Starred" />
                      </ListItemButton>
                    </List>
                  </Collapse>
                </List>
              </ListWrapperStyle>
            </Block>
          </Grid>

          <Grid item xs={12} md={6}>
            <Block title="Folder">
              <ListWrapperStyle>
                <List>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <ImageIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Photos" secondary="Jan 9, 2014" />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <WorkIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Work" secondary="Jan 7, 2014" />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <BeachAccessIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Vacation" secondary="July 20, 2014" />
                  </ListItem>
                </List>
              </ListWrapperStyle>
            </Block>
          </Grid>

          <Grid item xs={12} md={6}>
            <Block title="Selected">
              <ListWrapperStyle>
                <List component="nav" aria-label="main mailbox folders">
                  <ListItemButton selected={selectedIndex === 0} onClick={(event) => handleListItemClick(event, 0)}>
                    <ListItemIcon>
                      <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary="Inbox" />
                  </ListItemButton>
                  <ListItemButton selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1)}>
                    <ListItemIcon>
                      <DraftsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Drafts" />
                  </ListItemButton>
                </List>

                <Divider />

                <List component="nav" aria-label="secondary mailbox folder">
                  <ListItemButton selected={selectedIndex === 2} onClick={(event) => handleListItemClick(event, 2)}>
                    <ListItemText primary="Trash" />
                  </ListItemButton>
                  <ListItemButton selected={selectedIndex === 3} onClick={(event) => handleListItemClick(event, 3)}>
                    <ListItemText primary="Spam" />
                  </ListItemButton>
                </List>
              </ListWrapperStyle>
            </Block>
          </Grid>

          <Grid item xs={12} md={6}>
            <Block title="Controls">
              <ListWrapperStyle>
                <List>
                  {[0, 1, 2, 3].map((value) => {
                    const labelId = `checkbox-list-label-${value}`;
                    return (
                      <ListItemButton key={value} role={undefined} dense onClick={handleCheck(value)}>
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={checked.indexOf(value) !== -1}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                        </ListItemIcon>
                        <ListItemText id={labelId} primary={`Line item ${value + 1}`} />
                        <ListItemSecondaryAction>
                          <IconButton edge="end">
                            <CommentIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItemButton>
                    );
                  })}
                </List>
              </ListWrapperStyle>
            </Block>
          </Grid>

          <Grid item xs={12} md={6}>
            <Block title="Switch">
              <ListWrapperStyle>
                <List subheader={<ListSubheader>Settings</ListSubheader>}>
                  <ListItem>
                    <ListItemIcon>
                      <WifiIcon />
                    </ListItemIcon>
                    <ListItemText id="switch-list-label-wifi" primary="Wi-Fi" />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        onChange={handleToggle('wifi')}
                        checked={toggle.indexOf('wifi') !== -1}
                        inputProps={{
                          'aria-labelledby': 'switch-list-label-wifi'
                        }}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <BluetoothIcon />
                    </ListItemIcon>
                    <ListItemText id="switch-list-label-bluetooth" primary="Bluetooth" />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        onChange={handleToggle('bluetooth')}
                        checked={toggle.indexOf('bluetooth') !== -1}
                        inputProps={{
                          'aria-labelledby': 'switch-list-label-bluetooth'
                        }}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </ListWrapperStyle>
            </Block>
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  );
}
