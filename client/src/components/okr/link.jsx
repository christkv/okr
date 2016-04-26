import Modal from 'react-modal';
import React from 'react';
import co from 'co';
import {Input, OverlayTrigger, Popover} from 'react-bootstrap';
import SearchBar from '../search';
import Loader from 'react-loader';
import {dispatch} from '../utils';
import Actions from '../../store/constants'

var determineMatches = function(searchTerm, okrsById, results) {
  var finalResults = [];
  // Create the regular expression
  var regexp = new RegExp(searchTerm, 'i');

  // var results = results.map(function(result) {
  for(var i = 0; i < results.length; i++) {
    var result = results[i];
    if(result.objective.match(regexp)) {
      finalResults.push({
        id: result._id,
        type: 'objective',
        text: result.objective,
        owner: okrsById[result.okr_id].name,
        ownerType: okrsById[result.okr_id].type
      });
    }

    for(var j = 0; j < result.keyResults.length; j++) {
      if(result.keyResults[j].keyResult.match(regexp)) {
        finalResults.push({
          id: result._id,
          key_result_id: result.keyResults[j].id,
          type: 'keyResult',
          text: result.keyResults[j].keyResult,
          owner: okrsById[result.okr_id].name,
          ownerType: okrsById[result.okr_id].type
        });
      }
    }
  };

  return finalResults;
}

export default React.createClass({
  getInitialState: function() {
    return {results: [], loaded:true}
  },

  componentWillReceiveProps: function(nextProps) {
    if(nextProps.isOpen) {
      this.setState({results: []});
    }
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
      // Get all the okr ids
      var okrIds = results.map(function(r) { return r.okr_id; });
      // Fetch all the okrs
      var okrs = yield self.props.store.OKR().loadOKRs(okrIds);
      // Make okrs indexed
      var okrsById = {};
      // Lookup by okr
      for(var i = 0; i < okrs.length; i++) okrsById[okrs[i]._id] = okrs[i];
      // Filter the results by type
      results = determineMatches(searchTerm, okrsById, results);
      // Update the state
      self.setState({results: results, loaded: true});
    }).catch(function(e) {
      console.log(e.stack)
      if(self.props.onError) self.props.onError(e);
    });
  },

  onLink: function(e) {
    // console.log("================================== onLink")
    // console.log(e.target.dataset)
    // Parse the dataset id
    var id = parseInt(e.target.dataset.id, 10);
    // Close modal
    this.closeModal();
    // All the results
    var results = this.state.results || [];
    // Locate the result
    for(var i = 0; i < results.length; i++) {
      if(results[i].id == id) {
        // Build result
        var object = results[i].key_result_id
          ? { link_objective_id: results[i].id, link_key_result_id: results[i].key_result_id }
          : { link_objective_id: results[i].id };

        // Dispatch the OKR_SAVE_LINK action
        return dispatch(this.props, Actions.OKR_SAVE_LINK, Object.assign(this.props.data, object))
      }
    }
  },

  // Render the component
  render: function() {
    // Filter the results
    var results = this.state.results || [];
    // Results from the search
    results = results.map((result, i) => {
      var type = result.type == 'keyResult' ? 'Key Result' : 'Objective';
      return (
        <tr key={i}>
          <td>{type}</td>
          <td>{result.text}</td>
          <td>{result.owner}</td>
          <td>{result.ownerType}</td>
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
              <th>Text</th>
              <th>Owner</th>
              <th>Owner Type</th>
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
