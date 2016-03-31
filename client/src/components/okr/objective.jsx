import React from 'react';
import {ProgressBar} from 'react-bootstrap';
import KeyResult from './key_result';

export default React.createClass({
  getInitialState: function() {
    return {keyResults: []};
  },

  // Key result changed
  onKeyResultChange: function(change, value, keyResult) {
    if(change == 'modifiedText' && this.props.onObjectiveChange) {
      this.props.onObjectiveChange({
        type: 'keyResultChange', objectiveId: this.props.data.id,
        keyResultId: keyResult.id, value: value
      });
    } else if(change == 'removedTag' && this.props.onObjectiveChange) {
      this.props.onObjectiveChange({
        type: 'removeTag', objectiveId: this.props.data.id,
        keyResultId: keyResult.id, keyResult: keyResult
      });
    } else if(change == 'addTag' && this.props.onObjectiveChange) {
      this.props.onObjectiveChange({
        type: 'addTag', objectiveId: this.props.data.id,
        keyResultId: keyResult.id, keyResult: keyResult
      });
    }
  },

  // Objective changed
  onObjectiveChange: function(e) {
    if(this.props.onObjectiveChange) {
      this.props.onObjectiveChange({
        type: 'objectiveChange', objectiveId: this.props.data.id,
        value: e.target.value
      });
    }
  },

  // Render the component
  render: function() {
    // Render the key results
    var keyResults = this.props.data.keyResults.map((keyResult) => {
      return <KeyResult key={keyResult.id} data={keyResult} edit={this.props.edit} onChange={this.onKeyResultChange}/>
    });

    // Handle if the component is in edit more or not
    var objective = this.props.edit
      ? ( <input type='text' value={this.props.data.objective} onChange={this.onObjectiveChange}/> )
      : ( <label>{this.props.data.objective}</label> );

    // Render the template for an objective
    return (
      <div>
        <table className="table table-striped">
          <tbody>
            <tr>
              <td colSpan="3">{objective}</td>
            </tr>
            {keyResults}
          </tbody>
        </table>
      </div>
    );
  }
});
