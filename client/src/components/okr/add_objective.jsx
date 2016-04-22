import Modal from 'react-modal';
import React from 'react';
import co from 'co';
import {Input} from 'react-bootstrap';

export default React.createClass({
  getInitialState: function() {
    return {}
  },

  // Close modal
  closeModal: function(e) {
    if(this.props.closeModal) this.props.closeModal();
  },

  onSave: function(e) {
  },

  // Render the component
  render: function() {
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
        <div className="modal-content objective">
          <div className="modal-header">
            <button type="button" className="close" onClick={this.closeModal}>
              <span aria-hidden="true">&times;</span>
              <span className="sr-only">Close</span>
            </button>
            <h4 className="modal-title">Add New Objective</h4>
          </div>
          <div className="modal-body">
            <Input type="textarea" label="Objective" placeholder="Write objective"/>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-default" onClick={this.closeModal}>Close</button>
            <button type="button" className="btn btn-primary" onClick={this.onSave}>Add</button>
          </div>
        </div>
      </Modal>
    );
  }
});
