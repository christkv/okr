import Modal from 'react-modal';
import React from 'react';
import Store from '../../store';
import co from 'co';
import {WithContext} from 'react-tag-input';
import Actions from '../../store/constants'
import {dispatch} from '../utils';

export default React.createClass({
  getInitialState: function() {
    return {
      tags: [],
      suggestions: []
    }
  },

  // Component became visible
  componentDidMount: function() {
    var self = this;
  },

  componentWillReceiveProps: function(nextProps) {
    console.log("!!!!!!!!!!!!!!!!! componentWillReceiveProps")
    console.log(nextProps)
    var tags = nextProps.tags || [];
    tags = tags.map(function(tag, index) {
      return {id: index, text: tag};
    })

    this.setState({tags: tags, suggestions: nextProps.suggestions || []});
  },

  // Close modal
  closeModal: function(e) {
    if(this.props.closeModal) this.props.closeModal();
  },

  saveChanges: function() {
    dispatch(this.props, Actions.OKR_SAVE_TAGS, Object.assign(this.props.data, {tags: this.state.tags}))
  },

  handleDelete: function(i) {
    this.state.tags.splice(i, 1);
    this.setState({tags: this.state.tags});
  },

  handleAddition: function(tag) {
    // Don't allow duplicates
    for(var t of this.state.tags) {
      if(t.text == tag) return;
    }

    // Add to the list of tags
    this.state.tags.push({
      id: this.state.tags.length + 1, text: tag
    });

    this.setState({tags: this.state.tags});
  },

  handleDrag: function(tag, currPos, newPos) {
    // mutate array
    this.state.tags.splice(currPos, 1);
    this.state.tags.splice(newPos, 0, tag);
    // re-render
    this.setState({ tags: this.state.tags });
  },

  // Render the component
  render: function() {
    console.log("!!!!!!!!!!!!!!!!!!!!!! render addtag")
    console.log(this.state)
    // Render the modal dialog
    return (
      <Modal
        isOpen={this.props.isOpen}
        onRequestClose={this.closeModal}
        style={{
          content: {
            top: '5%', left: '25%', right: '25%', bottom: '50%',
            border: '0px solid #ccc',
            background: 'none',
            overflow: 'hidden'
          },
          overlay: {
            right: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.0)'
          }
        }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" onClick={this.closeModal}>
              <span aria-hidden="true">&times;</span>
              <span className="sr-only">Close</span>
            </button>
            <h4 className="modal-title">Add Tag - {this.props.text}</h4>
          </div>
          <div className="modal-body container">
            <WithContext tags={this.state.tags}
              suggestions={this.state.suggestions}
              handleDelete={this.handleDelete}
              handleAddition={this.handleAddition}
              handleDrag={this.handleDrag} />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" onClick={this.saveChanges}>Save changes</button>
            <button type="button" className="btn btn-default" onClick={this.closeModal}>Close</button>
          </div>
        </div>
      </Modal>
    );
  }
});
