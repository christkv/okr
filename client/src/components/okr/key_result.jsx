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
      ? ( <input type='text' value={this.props.data.keyResult} onChange={this.onChange}/> )
      : ( <label>{this.props.data.keyResult}</label> );

    // Render any tags if they exist
    var tags = this.props.data.tags || [];

    // Render all the tag labels
    var labels = tags.map((tag, index) => {
      if(this.props.edit) {
        return (
          <Label bsStyle='info' key={index}>
            {tag}
          </Label>
        )
      } else {
        return ( <Label bsStyle='info' key={index}>{tag}</Label>)
      }
    });

    // Create add tag button if we are in edit mode
    var addTag = this.props.edit
      ? ( <OverlayTrigger placement="bottom" overlay={<Popover id='test' title="Add tag">Add a tag to the key result.</Popover>}>
            <button type="button" style={{fontSize:8}} className="btn btn-default btn-xs" onClick={this.onAddTag}>
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
        <td>{keyResult}</td>
        <td>
          <ProgressBar now={this.props.data.completeness} label="%(percent)s%" />
        </td>
      </tr>
    );
  }
})
