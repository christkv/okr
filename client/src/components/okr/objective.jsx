import React from 'react';
import {ProgressBar, Label, OverlayTrigger, Popover} from 'react-bootstrap';
import KeyResult from './key_result';
import AddKeyResult from './add_keyresult';
import {dispatch} from '../utils';
import Actions from '../../store/constants';

export default React.createClass({
  getInitialState: function() {
    return {keyResults: [], addKeyResultIsOpen: false};
  },

  // Objective changed
  onObjectiveChange: function(e) {
    dispatch(this.props, Actions.OKR_OBJECTIVE_CHANGED, { objective_id: this.props.data._id, text: e.target.value });
  },

  onLink: function(e) {
    dispatch(this.props, Actions.OKR_LINK, { objective_id: this.props.data._id });
  },

  onRemoveObjective: function(e) {
    dispatch(this.props, Actions.OKR_DELETE_OBJECTIVE, { objective_id: this.props.data._id });
  },

  // Add a tag
  onAddTag: function(e) {
    dispatch(this.props, Actions.OKR_ADD_TAGS, { objective_id: this.props.data._id });
  },

  onComment: function(e) {
    dispatch(this.props, Actions.OKR_ADD_COMMENT, { objective_id: this.props.data._id });
  },

  dispatch(event, message) {
    dispatch(this.props, event, Object.assign(message, { objective_id: this.props.data._id }));
  },

  // Render the component
  render: function() {
    // Render the key results
    var keyResults = this.props.data.keyResults.map((keyResult) => {
      return <KeyResult
        key={keyResult.id}
        data={keyResult}
        edit={this.props.edit}
        rate={this.props.rate}
        dispatch={this.dispatch} />
    });

    // Show the linked keyresult/objective
    var linkType = this.props.data.link && this.props.data.link.key_result_id ? 'Key Result' : 'Objective';
    var link = this.props.data.link
      ? ( <div>
            <label>[{linkType}]:</label>
            <h7>{this.props.data.link.text}</h7>
          </div> )
      : ( <span/> );

    // Handle if the component is in edit more or not
    var objective = this.props.edit
      ? ( <div>
          <input type='text' value={this.props.data.objective} onChange={this.onObjectiveChange}/>
          {link}
        </div> )
      : ( <div>
          <label>{this.props.data.objective}</label>
          {link}
        </div> );

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

    // Create a comment button
    var addComment = ( <OverlayTrigger placement="bottom" overlay={<Popover id='test' title="Add Comment">Add a comment about the objective.</Popover>}>
          <button type="button" style={{fontSize:8, display: 'inline-block'}} className="btn btn-default btn-sm" onClick={this.onComment}>
            Comment
          </button>
        </OverlayTrigger> );

    // Remote a add keyResult button
    var removeObjective = this.props.edit
      ? ( <OverlayTrigger placement="bottom" overlay={<Popover id='test' title="Remove an Objective">Remove an objective and all its Key Results.</Popover>}>
            <button type="button" style={{fontSize:8, display: 'inline-block'}} className="btn btn-default btn-sm" onClick={this.onRemoveObjective}>
              Delete
            </button>
          </OverlayTrigger> )
      : (<span/>);

    // Create a add keyResult button
    var addKeyResult = this.props.edit
      ? ( <OverlayTrigger placement="bottom" overlay={<Popover id='test' title="Add Key Result">Add a new key result.</Popover>}>
            <button type="button" style={{fontSize:8, display: 'inline-block'}} className="btn btn-default btn-sm" onClick={() => { this.setState({addKeyResultIsOpen:true}); }}>
              Add
            </button>
          </OverlayTrigger> )
      : (<span/>);

    // Create a add keyResult button
    var linkButton = this.props.edit
      ? ( <OverlayTrigger placement="bottom" overlay={<Popover id='test' title="Link Objective">Link Objective.</Popover>}>
            <button type="button" style={{fontSize:8, display: 'inline-block'}} className="btn btn-default btn-sm" onClick={this.onLink}>
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
              <td>{addComment}<br/>{addKeyResult}<br/>{linkButton}<br/>{removeObjective}</td>
            </tr>
            {keyResults}
          </tbody>
        </table>

        <AddKeyResult
          id={this.props.data._id}
          isOpen={this.state.addKeyResultIsOpen}
          closeModal={() => {this.setState({addKeyResultIsOpen:false});}}
          dispatch={this.dispatch}
        />
      </div>
    );
  }
});
