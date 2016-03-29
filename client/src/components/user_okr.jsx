import React from 'react';
import {Button} from 'react-bootstrap';

var fakeState = {
  edit:false,
  objectives: [{
    id: 1,
    objective: 'objective 1',

    keyResults: [{
      id: 5,
      keyResult: 'first key result'
    }]
  }]
}

var Objective = React.createClass({
  getInitialState: function() {
    return {keyResults: []};
  },

  // Key result changed
  onKeyResultChange: function(value, keyResult) {
    if(this.props.onObjectiveChange) {
      this.props.onObjectiveChange({
        type: 'keyResultChange', objectiveId: this.props.data.id,
        keyResultId: keyResult.id, value: value
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
      : ( <h2>{this.props.data.objective}</h2> );

    // Render the template for an objective
    return (
      <table className="table table-striped">
        <tbody>
          <tr>
            <td colSpan="3">{objective}</td>
          </tr>
          {keyResults}
        </tbody>
      </table>
    );
  }
});

var KeyResult = React.createClass({
  onChange: function(e) {
    if(this.props.onChange(e.target.value, this.props.data));
  },
  render: function() {
    // Handle if the component is in edit more or not
    var keyResult = this.props.edit
      ? ( <input type='text' value={this.props.data.keyResult} onChange={this.onChange}/> )
      : ( <h3>{this.props.data.keyResult}</h3> );

    // Render the key result
    return (
      <tr>
        <td></td>
        <td colSpan="2">{keyResult}</td>
      </tr>
    );
  }
})

var ToogleButton = React.createClass({
  getInitialState: function() {
    return {values: this.props.values, index: 0};
  },
  onClick: function() {
    this.state.index = (this.state.index + 1) % this.state.values.length;
    this.setState(this.state);
    // Signal the state change to the parent component
    if(this.props.onClick) this.props.onClick(this.state.index);
  },
  render: function() {
    return (
      <input type='button' value={this.state.values[this.state.index]} onClick={this.onClick}/>
    );
  }
})

export default React.createClass({
  getInitialState: function() {
    return {objectives: [], edit:false};
  },

  // Component became visible
  componentDidMount: function() {
    this.state = fakeState;
    this.setState(this.state);
  },

  // Edit button clicked
  editButtonClicked: function(index) {
    this.state.edit = index == 1;
    this.setState(this.state);
  },

  // On objective Change
  onObjectiveChange: function(e) {
    // Handle objective text changed
    var objectiveChanged = function(state, change) {
      return state.objectives.map((objective) => {
        if(objective.id == change.objectiveId) {
          objective.objective = change.value;
          objective.modified = true;
        }

        return objective;
      });
    }

    // Handle key result text changed
    var keyResultChanged = function(state, change) {
      return state.objectives.map(function(objective) {
        if(objective.id == change.objectiveId) {
          objective.keyResults = objective.keyResults.map((keyResult) => {
            if(keyResult.id == change.keyResultId) {
              keyResult.keyResult = change.value;
              keyResult.modified = true;
            }

            return keyResult;
          });
        }

        return objective;
      })
    }

    // Update objectives
    this.state.objectives = e.type == 'objectiveChange'
      ? objectiveChanged(this.state, e)
      : keyResultChanged(this.state, e);

    // Update state
    this.setState(this.state);
  },

  // Render the okr component
  render: function() {
    var objectives = this.state.objectives.map((objective) => {
      return (
        <Objective key={objective.id}
            data={objective}
            edit={this.state.edit}
            onObjectiveChange={this.onObjectiveChange}/>
      )
    });

    return (
      <div id="user-okr" className="user-okr">
        <h1>OKR</h1>
        <Button bsStyle="primary">Primary</Button>
        <ToogleButton values={["edit", "save"]} onClick={this.editButtonClicked}/>
        {objectives}
      </div>
    );
  }
});
