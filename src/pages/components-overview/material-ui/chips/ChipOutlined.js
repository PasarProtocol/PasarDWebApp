// material
import FaceIcon from '@mui/icons-material/Face';
import DoneIcon from '@mui/icons-material/Done';
import { Avatar, Chip, Stack, Paper } from '@mui/material';
//
import { Label } from '../../Block';

// ----------------------------------------------------------------------

const style = {
  p: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  '& > *': { m: '8px !important' }
};

// ----------------------------------------------------------------------

export default function ChipOutlined() {
  const handleDelete = () => {
    console.info('You clicked the delete icon.');
  };

  const handleClick = () => {
    console.info('You clicked the Chip.');
  };

  return (
    <Stack spacing={3}>
      <div>
        <Label title="Base" />
        <Paper variant="outlined" sx={style}>
          <Chip variant="outlined" label="Basic" />
          <Chip variant="outlined" label="Disabled" disabled />
          <Chip variant="outlined" avatar={<Avatar>B</Avatar>} label="Clickable" onClick={handleClick} />
          <Chip
            variant="outlined"
            avatar={<Avatar alt="Natacha" src="/static/mock-images/avatars/avatar_1.jpg" />}
            label="Deletable"
            onDelete={handleDelete}
          />
          <Chip
            variant="outlined"
            icon={<FaceIcon />}
            label="Clickable deletable"
            onClick={handleClick}
            onDelete={handleDelete}
          />
          <Chip
            variant="outlined"
            label="Custom delete icon"
            onClick={handleClick}
            onDelete={handleDelete}
            deleteIcon={<DoneIcon />}
          />
          <Chip variant="outlined" label="Clickable Link" component="a" href="#chip" clickable />
          <Chip
            variant="outlined"
            avatar={<Avatar>M</Avatar>}
            label="Primary clickable"
            clickable
            color="primary"
            onDelete={handleDelete}
            deleteIcon={<DoneIcon />}
          />
          <Chip
            variant="outlined"
            icon={<FaceIcon />}
            label="Primary clickable"
            clickable
            color="primary"
            onDelete={handleDelete}
            deleteIcon={<DoneIcon />}
          />
          <Chip variant="outlined" label="Deletable primary" onDelete={handleDelete} color="primary" />
        </Paper>
      </div>

      <div>
        <Label title="Colors" />
        <Paper variant="outlined" sx={style}>
          <Chip
            variant="outlined"
            label="Default deletable"
            avatar={<Avatar alt="Natacha" src="/static/mock-images/avatars/avatar_1.jpg" />}
            onDelete={handleDelete}
            deleteIcon={<DoneIcon />}
          />

          <Chip
            variant="outlined"
            clickable
            label="Default clickable"
            avatar={<Avatar alt="Natacha" src="/static/mock-images/avatars/avatar_1.jpg" />}
            onDelete={handleDelete}
            deleteIcon={<DoneIcon />}
          />

          <Chip
            variant="outlined"
            label="Primary deletable"
            avatar={<Avatar alt="Natacha" src="/static/mock-images/avatars/avatar_1.jpg" />}
            color="primary"
            onDelete={handleDelete}
            deleteIcon={<DoneIcon />}
          />

          <Chip
            variant="outlined"
            clickable
            label="Primary clickable"
            avatar={<Avatar alt="Natacha" src="/static/mock-images/avatars/avatar_1.jpg" />}
            color="primary"
            onDelete={handleDelete}
            deleteIcon={<DoneIcon />}
          />

          <Chip
            variant="outlined"
            icon={<FaceIcon />}
            label="Secondary deletable"
            onDelete={handleDelete}
            color="secondary"
            deleteIcon={<DoneIcon />}
          />

          <Chip
            variant="outlined"
            clickable
            icon={<FaceIcon />}
            label="Secondary clickable"
            onDelete={handleDelete}
            color="secondary"
            deleteIcon={<DoneIcon />}
          />

          <Chip
            variant="outlined"
            icon={<FaceIcon />}
            label="Info deletable"
            onDelete={handleDelete}
            color="info"
            deleteIcon={<DoneIcon />}
          />

          <Chip
            variant="outlined"
            clickable
            icon={<FaceIcon />}
            label="Info clickable"
            onDelete={handleDelete}
            color="info"
            deleteIcon={<DoneIcon />}
          />

          <Chip
            variant="outlined"
            icon={<FaceIcon />}
            label="Success deletable"
            onDelete={handleDelete}
            color="success"
          />

          <Chip
            variant="outlined"
            clickable
            icon={<FaceIcon />}
            label="Success clickable"
            onDelete={handleDelete}
            color="success"
          />

          <Chip
            variant="outlined"
            icon={<FaceIcon />}
            label="Warning deletable"
            onDelete={handleDelete}
            color="warning"
          />

          <Chip
            variant="outlined"
            clickable
            icon={<FaceIcon />}
            label="Warning clickable"
            onDelete={handleDelete}
            color="warning"
          />

          <Chip variant="outlined" icon={<FaceIcon />} label="Error deletable" onDelete={handleDelete} color="error" />

          <Chip
            variant="outlined"
            clickable
            icon={<FaceIcon />}
            label="Error clickable"
            onDelete={handleDelete}
            color="error"
          />
        </Paper>
      </div>

      <div>
        <Label title="Size" />
        <Paper variant="outlined" sx={style}>
          <Chip variant="outlined" avatar={<Avatar>M</Avatar>} label="Normal" onDelete={handleDelete} color="info" />

          <Chip
            variant="outlined"
            size="small"
            avatar={<Avatar>M</Avatar>}
            label="Small"
            onDelete={handleDelete}
            color="info"
          />
        </Paper>
      </div>
    </Stack>
  );
}
