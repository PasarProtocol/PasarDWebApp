import { useState } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
// material
import { styled } from '@mui/material/styles';
import { Box, Card, Grid, Stack, Container, CardHeader, Typography, CardContent } from '@mui/material';
// routes
import { PATH_PAGE } from '../../../routes/paths';
// components
import Page from '../../../components/Page';
import Markdown from '../../../components/Markdown';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import { QuillEditor, DraftEditor } from '../../../components/editor';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  paddingTop: theme.spacing(11),
  paddingBottom: theme.spacing(15)
}));

// ----------------------------------------------------------------------

export default function Editor() {
  const [quillSimple, setQuillSimple] = useState('');
  const [quillFull, setQuillFull] = useState('');
  const [draftSimple, setDraftSimple] = useState(EditorState.createEmpty());

  return (
    <RootStyle title="Components: Editor | Minimal-UI">
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
            heading="Editor"
            links={[{ name: 'Components', href: PATH_PAGE.components }, { name: 'Editor' }]}
            moreLink={['https://github.com/zenoamaro/react-quill', 'https://jpuri.github.io/react-draft-wysiwyg']}
          />
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardHeader title="Quill Editor Simple" />
              <CardContent>
                <QuillEditor
                  simple
                  id="simple-editor"
                  value={quillSimple}
                  onChange={(value) => setQuillSimple(value)}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={3} sx={{ height: 1 }}>
              <Card sx={{ height: 1, boxShadow: 0, bgcolor: 'background.neutral' }}>
                <CardHeader title="Preview Plain Text" />
                <Box sx={{ p: 3 }}>
                  <Markdown children={quillSimple} />
                </Box>
              </Card>
              <Card sx={{ height: 1, boxShadow: 0, bgcolor: 'background.neutral' }}>
                <CardHeader title="Preview Html" />
                <Typography sx={{ p: 3 }}>{quillSimple}</Typography>
              </Card>
            </Stack>
          </Grid>
        </Grid>

        <Grid container sx={{ mt: 3, mb: 5 }}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardHeader title="Quill Editor Full" />
              <CardContent>
                <QuillEditor id="full-editor" value={quillFull} onChange={(value) => setQuillFull(value)} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardHeader title="Draft Editor Simple" />
              <CardContent>
                <DraftEditor simple editorState={draftSimple} onEditorStateChange={(value) => setDraftSimple(value)} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack spacing={3} sx={{ height: 1 }}>
              <Card sx={{ height: 1, boxShadow: 0, bgcolor: 'background.neutral' }}>
                <CardHeader title="Preview Plain Text" />
                <Typography sx={{ p: 3 }}>{draftSimple.getCurrentContent().getPlainText('\u0001')}</Typography>
              </Card>

              <Card sx={{ height: 1, boxShadow: 0, bgcolor: 'background.neutral' }}>
                <CardHeader title="Preview Html" />
                <Typography sx={{ p: 3 }}>{draftToHtml(convertToRaw(draftSimple.getCurrentContent()))}</Typography>
              </Card>
            </Stack>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardHeader title="Draft Editor Full" />
              <CardContent>
                <DraftEditor />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  );
}
