import React from 'react';
import {Button, ProgressBar, OverlayTrigger, Popover} from 'react-bootstrap';
import ToogleButton from './toggle_button';
import Objective from './okr/objective';
import co from 'co';
import AddTag from './okr/add_tag';
import AddObjective from './okr/add_objective';
import Actions from '../store/constants'

export default React.createClass({
  getInitialState: function() {
    return {
      edit: false,
      rate: true,
      tagEditorText: 'objective',

      // State variables for the add tag dialog
      tags: [],
      suggestions: []
    }
  },

  // Component became visible
  componentDidMount: function() {
    // Set the default properties
    this.setState({
      currentUser: this.props.currentUser,
      user: this.props.user,
      okr: this.props.okr,
    });
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      edit: typeof nextProps.edit == 'boolean' ? nextProps.edit : false,
      rate: typeof nextProps.rate == 'boolean' ? nextProps.rate : true,
    });
  },

  dispatch(event, message) {
    if(this.props.dispatch) dispatch(event, message);
  },

  // On Add objective
  onAddObjective: function() {
    this.setState({ addObjectiveIsOpen: true });
  },

  // Close any of the modal forms
  closeModal: function() {
    this.setState({ addTagIsOpen:false, addObjectiveIsOpen: false, addKeyResultIsOpen:false });
  },

  // Render the okr component
  render: function() {
    console.log("- render OKR")
    console.log(this.state)
    var objectives = [];

    if(this.props.okr && this.props.okr.objectives) {
      objectives = this.props.okr.objectives.map((objective) => {
        return (
          <Objective key={objective.id}
            data={objective}
            edit={this.state.edit}
            rate={this.state.rate}
            tags={objective.tags}
            store={this.props.store}
          />
        )
      });
    }

    // Edit button
    var editButton = (<span/>);
    if(this.state.edit) {
      editButton = ( <ToogleButton values={["edit", "save"]} onClick={() => { this.setState({edit:true}) }}/> );
    }

    // Create a add keyResult button
    var addObjective = this.state.edit
      ? ( <OverlayTrigger placement="bottom" overlay={<Popover id='test' title="Add New Objective">Add a new objective.</Popover>}>
            <button className="toggle_button btn btn-primary btn-xs" onClick={this.onAddObjective}>
              Add
            </button>
          </OverlayTrigger> )
      : (<span/>);

    var commentsButton = (
      <button className='toggle_button btn btn-primary btn-xs'
        onClick={() => { this.dispatch(Actions.OKR_COMMENT_BUTTON_CLICKED) }}>Comments</button>
    );

    return (
      <div id="user-okr" className="user-okr">
        {editButton}
        {addObjective}
        {commentsButton}
        {objectives}

        <AddTag
          isOpen={this.state.addTagIsOpen}
          closeModal={this.closeModal}
          text={this.state.tagEditorText}
          store={this.props.store}
          tags={this.state.tags}
          suggestions={this.state.suggestions}
        />

        <AddObjective
          isOpen={this.state.addObjectiveIsOpen}
          closeModal={this.closeModal}
          store={this.props.store}
        />
      </div>
    );
  }
});
