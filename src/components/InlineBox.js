// ----------------------------------------------------------------------

export default function InlineBox(props) {
  return (
    <span style={{ display: 'inline-block' }}>
      {props.children}
    </span>
  );
}
