import React from 'react';
import {Button, ProgressBar, OverlayTrigger, Popover} from 'react-bootstrap';
import ToogleButton from './toggle_button';
import Objective from './okr/objective';
import co from 'co';
import AddTag from './okr/add_tag';
import AddObjective from './okr/add_objective';
import Actions from '../store/constants';
import Link from './okr/link';
import ConfirmDelete from './okr/confirm_delete';

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
      editOKR: typeof nextProps.edit == 'boolean' ? nextProps.edit : false
    });
  },

  dispatch(event, message) {
    console.log("============================================== dispatch :: " + event)
    console.log(message)
    if(event == Actions.OKR_LINK) {
      return this.setState({linkIsOpen:true});
    } else if(event == Actions.OKR_ADD_TAG) {
      return this.setState({addTagIsOpen:true});
    } else if(event == Actions.OKR_DELETE_OBJECTIVE || event == Actions.OKR_DELETE_KEY_RESULT) {
      return this.setState({confirmDeleteOpen: true, confirmDeleteData: message});
    }

    // Dispatch the event upwards
    if(this.props.dispatch) this.props.dispatch(event, message);
  },

  // Close any of the modal forms
  closeModal: function() {
    this.setState({ addTagIsOpen:false,
      addObjectiveIsOpen: false,
      addKeyResultIsOpen:false,
      linkIsOpen: false,
      confirmDeleteOpen: false
    });
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
            edit={this.state.editOKR}
            rate={this.state.rate}
            tags={objective.tags}
            store={this.props.store}
            dispatch={this.dispatch}
          />
        )
      });
    }

    // Edit button
    var editButton = (<span/>);
    if(this.state.edit) {
      editButton = ( <ToogleButton index={this.state.editOKR ? 1 : 0} values={["edit", "save"]} onClick={() => { this.setState({editOKR: !this.state.editOKR}) }}/> );
    }

    // Create a add keyResult button
    var addObjective = this.state.edit
      ? ( <OverlayTrigger placement="bottom" overlay={<Popover id='test' title="Add New Objective">Add a new objective.</Popover>}>
            <button className="toggle_button btn btn-primary btn-xs" onClick={() => { this.setState({ addObjectiveIsOpen: true }); }}>
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
          dispatch={this.dispatch}
        />

        <Link
          isOpen={this.state.linkIsOpen}
          closeModal={this.closeModal}
          store={this.props.store}
          dispatch={this.dispatch}
        />

        <ConfirmDelete
          isOpen={this.state.confirmDeleteOpen}
          closeModal={this.closeModal}
          store={this.props.store}
          dispatch={this.dispatch}
          data={this.state.confirmDeleteData}
        />
      </div>
    );
  }
});
