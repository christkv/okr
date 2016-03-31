import React from 'react';
import {ProgressBar, Label, Popover, OverlayTrigger} from 'react-bootstrap';

export default React.createClass({
  onChange: function(e) {
    if(this.props.onChange) this.props.onChange('modifiedText', e.target.value, this.props.data);
  },

  onAddTag: function(e) {
    if(this.props.onChange) this.props.onChange('addTag', null, this.props.data);
  },

  render: function() {
    // Handle if the component is in edit more or not
    var keyResult = this.props.edit
      ? ( <textarea onChange={this.onChange}>{this.props.data.keyResult}</textarea> )
      : ( <label>{this.props.data.keyResult}</label> );

    // Render any tags if they exist
    var tags = this.props.data.tags || [];

    // Render all the tag labels
    var labels = tags.map((tag, index) => {
      if(this.props.edit) {
        return (
          <span>
            <Label bsStyle='info' key={index}>
              {tag}
            </Label>
            <br/>
          </span>
        )
      } else {
        return (
          <span>
            <Label bsStyle='info' key={index}>{tag}</Label><br/>
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

    // Render the key result
    return (
      <tr>
        <td>
          {labels}
          &nbsp;
          {addTag}
        </td>
        <td width='75%'>{keyResult}</td>
        <td width='25%'>
          <ProgressBar now={this.props.data.completeness} label="%(percent)s%" />
        </td>
      </tr>
    );
  }
})
