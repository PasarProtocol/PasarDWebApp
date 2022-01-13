import { Icon } from '@iconify/react';
import homeFill from '@iconify/icons-eva/home-fill';
import fileFill from '@iconify/icons-eva/file-fill';
import roundGrain from '@iconify/icons-ic/round-grain';
import bookOpenFill from '@iconify/icons-eva/book-open-fill';
// routes
import { PATH_DOCS, PATH_PAGE } from '../../routes/paths';

// ----------------------------------------------------------------------

const ICON_SIZE = {
  width: 22,
  height: 22
};

const menuConfig = [
  {
    title: 'Explorer',
    icon: <Icon icon={roundGrain} {...ICON_SIZE} />,
    path: PATH_PAGE.explorer,
    disable: false
  },
  {
    title: 'Marketplace',
    icon: <Icon icon={bookOpenFill} {...ICON_SIZE} />,
    path: PATH_PAGE.marketplace,
    disable: false
  },
  {
    title: 'Create',
    icon: <Icon icon={bookOpenFill} {...ICON_SIZE} />,
    path: PATH_PAGE.create,
    disable: false
  },
  {
    title: 'Docs',
    icon: <Icon icon={bookOpenFill} {...ICON_SIZE} />,
    path: PATH_DOCS,
    disable: true
  }
];

export default menuConfig;
