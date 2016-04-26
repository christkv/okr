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

//
// Locate tags field in eithr objective or okr
//
function locateTags(search, okr) {
  for(let objective of okr.objectives) {
    if(objective._id == search.objective_id) {
      if(!search.key_result_id) return objective.tags || [];

      for(let keyResult of objective.keyResults) {
        if(keyResult.id == search.key_result_id) {
          return keyResult.tags;
        }
      }
    }
  }

  return [];
}

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

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      currentUser: nextProps.currentUser,
      user: nextProps.user,
      okr: nextProps.okr,
      edit: typeof nextProps.edit == 'boolean' ? nextProps.edit : false,
      rate: typeof nextProps.rate == 'boolean' ? nextProps.rate : true,
      editOKR: typeof nextProps.edit == 'boolean' ? nextProps.edit : false,
      suggestions: nextProps.tagSuggestions || []
    });
  },

  dispatch(event, message) {
    var self = this;

    co(function*() {
      console.log("============================================== dispatch :: " + event)
      console.log(message)
      if(event == Actions.OKR_LINK) {
        return self.setState({linkIsOpen:true, linkData: message});
      } else if(event == Actions.OKR_ADD_TAGS) {
        return self.setState({addTagIsOpen:true, addTagData: message, tags: locateTags(message, self.props.okr)});
      } else if(event == Actions.OKR_DELETE_OBJECTIVE || event == Actions.OKR_DELETE_KEY_RESULT) {
        return self.setState({confirmDeleteOpen: true, confirmDeleteData: message});
      } else if(event == Actions.OKR_SAVE_TAGS) {
        // Create tags
        var tags = message.tags.map(function(tag) { return tag.text; });

        // Delete a key result or a complete objective
        if(message.objective_id && message.key_result_id) {
          yield self.state.okr.updateKeyResultTags(message.objective_id, message.key_result_id, tags);
        } else {
          yield self.state.okr.updateObjectiveTags(message.objective_id, tags);
        }

        // Reload the okr
        var okr = yield self.state.okr.reload();
        // Close the tag window
        return self.setState({addTagIsOpen: false, okr: okr});
      } else if(event == Actions.OKR_ADD_NEW_OBJECTIVE) {
        // Save the new objective to the okr
        yield self.state.okr.addNewObjective(message.text);
        // Reload the okr
        var okr = yield self.state.okr.reload();
        // Update the state
        return self.setState({okr: okr});
      } else if(event == Actions.OKR_ADD_NEW_KEY_RESULT) {
        // Save the new key result to the okr
        yield self.state.okr.addNewKeyResult(message.objective_id, message.text);
        // Reload the okr
        var okr = yield self.state.okr.reload();
        // Update the state
        return self.setState({okr: okr});
      } else if(event == Actions.OKR_CONFIRM_DELETE) {
        // Delete a key result or a complete objective
        if(message.objective_id && message.key_result_id) {
          yield self.state.okr.deleteKeyResult(message.objective_id, message.key_result_id);
        } else {
          yield self.state.okr.deleteObjective(message.objective_id);
        }

        // Reload the okr
        var okr = yield self.state.okr.reload();
        // Update the state
        return self.setState({okr: okr});
      } else if(event == Actions.OKR_SAVE_LINK) {
        if(message.objective_id && message.key_result_id) {
          yield self.state.okr.linkKeyResult(message.objective_id, message.key_result_id,
            message.link_objective_id, message.link_key_result_id);
        } else {
          yield self.state.okr.linkObjective(message.objective_id,
            message.link_objective_id, message.link_key_result_id);
        }

        // Reload the okr
        var okr = yield self.state.okr.reload();
        // Update the state
        return self.setState({okr: okr});
      }

      // Dispatch the event upwards
      if(self.props.dispatch) self.props.dispatch(event, message);
    }).catch(function(e) {
    });
  },

  // Close any of the modal forms
  closeModal: function() {
    this.setState({
      addTagIsOpen:false,
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
          <Objective key={objective._id}
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
          data={this.state.addTagData}
          dispatch={this.dispatch}
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
          data={this.state.linkData}
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
