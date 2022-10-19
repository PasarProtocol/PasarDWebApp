import PropTypes from 'prop-types';

InlineBox.propTypes = {
  children: PropTypes.node
};

export default function InlineBox(props) {
  return <span style={{ display: 'inline-block' }}>{props.children}</span>;
}
