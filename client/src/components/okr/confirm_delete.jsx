import Modal from 'react-modal';
import React from 'react';
import co from 'co';
import {Input} from 'react-bootstrap';
import Actions from '../../store/constants';
import {dispatch} from '../utils';

export default React.createClass({
  getInitialState: function() {
    return {}
  },

  closeModal: function(e) {
    if(this.props.closeModal) this.props.closeModal();
  },

  onDelete: function(e) {
    // Close dialog
    this.props.closeModal()
    // Dispatch new OKR
    dispatch(this.props, Actions.OKR_CONFIRM_DELETE, this.props.data);
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
            <h4 className="modal-title">Confirm delete</h4>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" onClick={this.onDelete}>Delete</button>
            <button type="button" className="btn btn-default" onClick={this.closeModal}>Cancel</button>
          </div>
        </div>
      </Modal>
    );
  }
});
