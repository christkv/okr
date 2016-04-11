import Modal from 'react-modal';
import React from 'react';
import {Button, ButtonToolbar} from 'react-bootstrap';

export default React.createClass({
  getInitialState: function() {
    return {}
  },

  componentWillUnmount: function(e) {
  },

  // Close modal
  closeModal: function(e) {
    if(this.props.closeModal) this.props.closeModal();
  },

  onDelete: function(e) {
    if(this.props.onDelete) this.props.onDelete();
  },

  // Render the component
  render: function() {
    // Render the modal dialog
    return (
      <Modal
        isOpen={this.props.isOpen}
        onRequestClose={this.closeModal}
      >
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" onClick={this.closeModal}>
              <span aria-hidden="true">&times;</span>
              <span className="sr-only">Close</span>
            </button>
            <h4 className="modal-title">{this.props.label}</h4>
          </div>
          <div className="modal-body container">
            <ButtonToolbar>
              <Button bsStyle="primary" bsSize="small" onClick={this.onDelete}>Delete</Button>
              <Button bsStyle="default" bsSize="small" onClick={this.closeModal}>Cancel</Button>
            </ButtonToolbar>
          </div>
          <div className="modal-footer">
          </div>
        </div>
      </Modal>
    );
  }
});
