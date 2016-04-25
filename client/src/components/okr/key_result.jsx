import React from 'react';
import {ProgressBar, Label, Popover, OverlayTrigger} from 'react-bootstrap';
import NumberInput from 'react-number-input';
import AceEditor from 'react-ace';
import Actions from '../../store/constants';
import {dispatch} from '../utils';

export default React.createClass({
  onAddTag: function(e) {
    dispatch(this.props, Actions.OKR_ADD_TAGS, {key_result_id: this.props.data.id});
  },

  onRemoveKeyResult: function(e) {
    dispatch(this.props, Actions.OKR_DELETE_KEY_RESULT, {key_result_id: this.props.data.id});
  },

  onLink: function(e) {
    dispatch(this.props, Actions.OKR_LINK, {key_result_id: this.props.data.id});
  },

  onRatingChange: function(value) {
    dispatch(this.props, Actions.OKR_KEY_RESULT_RATE_CHANGED, {key_result_id: this.props.data.id, rating: parseInt(event.target.value, 10)});
  },

  onChange: function(change) {
    dispatch(this.props, Actions.OKR_KEY_RESULT_CHANGED, {key_result_id: this.props.data.id, text: change});
  },

  render: function() {
    var name = `keyResult_${this.props.data.id}`;
    console.log(name)
    // Handle if the component is in edit more or not
    var keyResult = this.props.edit
      ? (<AceEditor
          mode="markdown"
          theme="github"
          height={150}
          width="100%"
          name={name}
          onChange={this.onChange}
          editorProps={{$blockScrolling: true}}
        /> )
      : ( <label>{this.props.data.keyResult}</label> );

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
      ? ( <OverlayTrigger placement="bottom" overlay={<Popover id='test' title="Add tag">Add a tag to the key result.</Popover>}>
            <button type="button" style={{fontSize:8, display: 'inline-block'}} className="btn btn-default btn-xs" onClick={this.onAddTag}>
              Edit
            </button>
          </OverlayTrigger> )
      : (<span/>);

    // Remote a add keyResult button
    var removeKeyResult = this.props.edit
      ? ( <OverlayTrigger placement="bottom" overlay={<Popover id='test' title="Remove Key Result">Remove a key result.</Popover>}>
            <button type="button" style={{fontSize:8, display: 'inline-block'}} className="btn btn-default btn-sm" onClick={this.onRemoveKeyResult}>
              Delete
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

    // Handle progress bar
    var progressBar = !this.props.rate
      ? ( <ProgressBar
        key={this.props.data.id}
        now={this.props.data.completeness}
        label="%(percent)s%" /> )
      : ( <NumberInput
        key={this.props.data.id}
        type='number'
        min={0}
        max={100}
        format="0"
        value={this.props.data.completeness}
        className='form-control'
        onChange={this.onRatingChange} />);

    // Render the key result
    return (
      <tr>
        <td></td>
        <td>
          {labels}
          &nbsp;
          {addTag}
        </td>
        <td width='75%'>
          {keyResult}
        </td>
        <td width='25%'>
          {progressBar}
        </td>
        <td>{linkButton}<br/>{removeKeyResult}</td>
      </tr>
    );
  }
})
