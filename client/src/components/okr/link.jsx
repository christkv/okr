import Modal from 'react-modal';
import React from 'react';
import co from 'co';
import {Input, OverlayTrigger, Popover} from 'react-bootstrap';
import SearchBar from '../search';
import Loader from 'react-loader';

export default React.createClass({
  getInitialState: function() {
    return {results: [], loaded:true}
  },

  // Component became visible
  componentDidMount: function() {
  },

  // Close modal
  closeModal: function(e) {
    if(this.props.closeModal) this.props.closeModal();
  },

  onSearch: function(searchTerm) {
    var self = this;
    // Set loader symbol
    this.setState({loaded:false})

    // Execute search
    co(function*() {
      // Get the results
      var results = yield self.props.store.OKR().searchAll(searchTerm);
      // Update the state
      self.setState({results: results, loaded: true});
    }).catch(function(e) {
      if(self.props.onError) self.props.onError(e);
    });
  },

  onLink: function(e) {
    if(this.props.onLink) this.props.onLink(e.target.dataset.id);
    this.closeModal();
  },

  // Render the component
  render: function() {
    // Results from the search
    var results = this.state.results || [];
    results = results.map((result, i) => {
      var type = result.type == 'keyResult' ? 'Key Result' : 'Objective';
      return (
        <tr key={i}>
          <td>{type}</td>
          <td>{result.owner_type}</td>
          <td>{result.owner}</td>
          <td>{result.title}</td>
          <td>
            <OverlayTrigger placement="bottom" overlay={<Popover id='test' title="Link">Link with this {type}</Popover>}>
              <button data-id={result.id} type="button" style={{fontSize:8, display: 'inline-block'}} className="btn btn-default btn-md" onClick={this.onLink}>
                Link
              </button>
            </OverlayTrigger>
          </td>
        </tr>
      );
    });

    var result = results.length > 0
      ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Type</th>
              <th>Owner Type</th>
              <th>Owner</th>
              <th>Title</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {results}
          </tbody>
        </table>
      )
      : (<span/>);

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
        <div className="modal-content link">
          <div className="modal-header">
            <button type="button" className="close" onClick={this.closeModal}>
              <span aria-hidden="true">&times;</span>
              <span className="sr-only">Close</span>
            </button>
            <table>
              <tbody>
                <tr>
                  <td>
                    <Loader scale={0.5} loaded={this.state.loaded}/>
                  </td>
                  <td>
                    <h4 className="modal-title">Link</h4>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="modal-body">
            <Input label='Search' wrapperClassName="wrapper">
              <SearchBar
                disableButton={true}
                placeholder='Search for objectives and key results'
                onSearch={this.onSearch}
              />
            </Input>
            {result}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-default" onClick={this.closeModal}>Close</button>
          </div>
        </div>
      </Modal>
    );
  }
});
