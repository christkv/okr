import React from 'react';
import {ProgressBar, Label, OverlayTrigger, Popover} from 'react-bootstrap';
import KeyResult from './key_result';
import AddKeyResult from './add_keyresult';

export default React.createClass({
  getInitialState: function() {
    return {keyResults: [], addKeyResultIsOpen: false};
  },

  // Key result changed
  onKeyResultChange: function(change, value, keyResult) {
    if(change == 'modifiedText' && this.props.onObjectiveChange) {
      this.props.onObjectiveChange({
        type: 'keyResultChange', objectiveId: this.props.data.id,
        keyResultId: keyResult.id, value: value
      });
    } else if(change == 'addTag' && this.props.onObjectiveChange) {
      this.props.onObjectiveChange({
        type: 'addKeyResultTag', objectiveId: this.props.data.id,
        keyResultId: keyResult.id, keyResult: keyResult
      });
    } else if(change == 'ratingChanged' && this.props.onObjectiveChange) {
      this.props.onObjectiveChange({
        type: 'ratingChanged', objectiveId: this.props.data.id,
        keyResultId: keyResult.id, keyResult: keyResult,
        value: value
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

  // Add a tag
  onAddTag: function(e) {
    if(this.props.onChange) {
      this.props.onChange('addTag', null, this.props.data);
    }
  },

  // Add a new key result
  onAddKeyResult: function(e) {
    this.setState({addKeyResultIsOpen:true});
  },

  closeKeyResult: function() {
    this.setState({addKeyResultIsOpen:false});
  },

  onKeyResultSave: function() {
  },

  // Render the component
  render: function() {
    console.log("================== render objective")
    // Render the key results
    var keyResults = this.props.data.keyResults.map((keyResult) => {
      return <KeyResult
        key={keyResult.id}
        data={keyResult}
        edit={this.props.edit}
        rate={this.props.rate}
        onChange={this.onKeyResultChange}/>
    });

    // Handle if the component is in edit more or not
    var objective = this.props.edit
      ? ( <input type='text' value={this.props.data.objective} onChange={this.onObjectiveChange}/> )
      : ( <label>{this.props.data.objective}</label> );

    // Objective calculation
    var okrCalculation = this.props.data.keyResults.map(function(keyResult) {
      return parseInt(keyResult.completeness, 10);
    }).reduce(function(prev, current) {
      return prev + current;
    }, 0) / this.props.data.keyResults.length;
    okrCalculation = isNaN(okrCalculation) ? 0 : okrCalculation;

    // Render any tags if they exist
    var tags = this.props.data.tags || [];

    // Render all the tag labels
    var labels = tags.map((tag, index) => {
      if(this.props.edit) {
        return (
          <span key={index}>
            <Label bsStyle='info'>
              {tag}
            </Label>
            <br/>
          </span>
        )
      } else {
        return (
          <span key={index}>
            <Label bsStyle='info'>{tag}</Label><br/>
          </span>
        )
      }
    });

    // Create add tag button if we are in edit mode
    var addTag = this.props.edit
      ? ( <OverlayTrigger placement="bottom" overlay={<Popover id='test' title="Add tag">Add a tag to the objective.</Popover>}>
            <button type="button" style={{fontSize:8, display: 'inline-block'}} className="btn btn-default btn-xs" onClick={this.onAddTag}>
              Edit
            </button>
          </OverlayTrigger> )
      : (<span/>);

    // Create a add keyResult button
    var addKeyResult = this.props.edit
      ? ( <OverlayTrigger placement="bottom" overlay={<Popover id='test' title="Add Key Result">Add a new key result.</Popover>}>
            <button type="button" style={{fontSize:8, display: 'inline-block'}} className="btn btn-default btn-sm" onClick={this.onAddKeyResult}>
              Add
            </button>
          </OverlayTrigger> )
      : (<span/>);

    // Create a add keyResult button
    var linkButton = this.props.edit
      ? ( <OverlayTrigger placement="bottom" overlay={<Popover id='test' title="Link Objective">Link Objective.</Popover>}>
            <button type="button" style={{fontSize:8, display: 'inline-block'}} className="btn btn-default btn-sm" onClick={this.onLinkObjective}>
              Link
            </button>
          </OverlayTrigger> )
      : (<span/>);

    // Render the template for an objective
    return (
      <div>
        <table className="table table-striped">
          <tbody>
            <tr>
              <td>
                {labels}
                &nbsp;
                {addTag}
              </td>
              <td colSpan="2">{objective}</td>
              <td><ProgressBar now={okrCalculation} label="%(percent)s%" /></td>
              <td>{addKeyResult}<br/>{linkButton}</td>
            </tr>
            {keyResults}
          </tbody>
        </table>
        <AddKeyResult
          isOpen={this.state.addKeyResultIsOpen}
          closeModal={this.closeKeyResult}
          onSave={this.onKeyResultSave}
        />
      </div>
    );
  }
});
