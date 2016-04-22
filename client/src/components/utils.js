module.exports = {
  dispatch: function(props, event, message) {
    if(props.dispatch) {
      props.dispatch(event, message);
    }
  }
}
