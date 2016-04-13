import React from 'react';
import {ProgressBar, Label, Popover, OverlayTrigger} from 'react-bootstrap';
import NumberInput from 'react-number-input';

export default React.createClass({
  onChange: function(e) {
    if(this.props.onChange) {
      this.props.onChange('modifiedText', e.target.value, this.props.data);
    }
  },

  onAddTag: function(e) {
    if(this.props.onChange) {
      this.props.onChange('addTag', null, this.props.data);
    }
  },

  onRemoveKeyResult: function(e) {
    if(this.props.onChange) {
      this.props.onChange('remove', null, this.props.data);
    }
  },

  onRatingChange: function(value) {
    if(this.props.onChange) {
      this.props.onChange('ratingChanged', parseInt(event.target.value, 10), this.props.data);
    }
  },

  render: function() {
    // Handle if the component is in edit more or not
    var keyResult = this.props.edit
      ? ( <textarea onChange={this.onChange} value={this.props.data.keyResult}/> )
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
        <td width='75%'>{keyResult}</td>
        <td width='25%'>
          {progressBar}
        </td>
        <td>{removeKeyResult}</td>
      </tr>
    );
  }
})
