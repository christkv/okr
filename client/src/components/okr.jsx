import React from 'react';
import {Button, ProgressBar, OverlayTrigger, Popover} from 'react-bootstrap';
import ToogleButton from './toggle_button';
import Store from '../store';
import Objective from './okr/objective';
import co from 'co';
import AddTag from './okr/add_tag';
import AddObjective from './okr/add_objective';

export default React.createClass({
  getInitialState: function() {
    return this.props.store.OKR().getState();
  },

  // Component became visible
  componentDidMount: function() {
    var self = this;
    console.log(this.props.store.OKR().getState())

    // Load the data
    co(function*() {
      // Load the user
      var user = yield self.props.store.User().load();
      // Load the OKR for the proposed user viewed by the current user
      yield self.props.store.OKR().load(self.props.params.userId, user);
      // Get the state
      self.setState(self.props.store.OKR().getState());
    });
  },

  // Edit button clicked
  editButtonClicked: function(index) {
    var self = this;

    // Fire edit button clicked
    co(function*() {
      yield self.props.store.OKR().dispatch({type: Store.OKR_EDIT_BUTTON_CLICKED, value: index});
      self.setState(self.props.store.OKR().getState());
    });
  },

  commentsButtonClicked: function(index) {
    if(this.props.commentsButtonClicked) this.props.commentsButtonClicked();
  },

  // On objective Change
  onObjectiveChange: function(e) {
    var self = this;

    co(function*() {
      if(e.type == 'keyResultChange') {
        yield self.props.store.OKR().dispatch({type: Store.OKR_CHANGED, value: e});
        self.setState(self.props.store.OKR().getState());
      } else if(e.type == 'addKeyResultTag') {
        // Load the tags
        yield self.props.store.Tags().load();
        // Set the modal controller to visible
        self.state.addTagIsOpen = true;
        // Set the modal payload
        self.state.addTagData = {
          id: e.keyResultId, type: 'keyResult', object: e.keyResult,
          text: e.keyResult.keyResult, tags: e.keyResult.tags,
          suggestions: self.props.store.Tags().tags()
        }

        // Update the state
        self.setState(self.state);
      } else if(e.type == 'ratingChanged') {
        yield self.props.store.OKR().dispatch({type: Store.OKR_RATING_CHANGED, value: e});
        self.setState(self.props.store.OKR().getState());
      }
    });
  },

  // On Add objective
  onAddObjective: function() {
    this.setState({
      addTagIsOpen:false, addObjectiveIsOpen: true, addKeyResultIsOpen:false
    });
  },

  closeObjective: function() {
    this.setState({
      addTagIsOpen:false, addObjectiveIsOpen: false, addKeyResultIsOpen:false
    });
  },

  // Tag changes
  onTagsSave: function(object) {
    if(object.type == 'keyResult') {
      object.object.tags = object.tags;
    } else if(object.type == 'objective') {

    }

    this.setState({
      addTagIsOpen:false, addObjectiveIsOpen: false, addKeyResultIsOpen:false
    });
  },

  // Close modal
  closeAddTag: function(e) {
    this.setState({addTagIsOpen:false});
  },

  // Render the okr component
  render: function() {
    var objectives = this.state.objectives.map((objective) => {
      return (
        <Objective key={objective.id}
            data={objective}
            edit={this.state.edit}
            rate={this.props.store.OKR().canRate()}
            tags={objective.tags}
            onObjectiveChange={this.onObjectiveChange}
        />
      )
    });

    var editButton = this.props.store.OKR().canEdit()
      ? ( <ToogleButton values={["edit", "save"]} onClick={this.editButtonClicked}/> )
      : ( <span/> );

    // Create a add keyResult button
    var addObjective = this.state.edit
      ? ( <OverlayTrigger placement="bottom" overlay={<Popover id='test' title="Add New Objective">Add a new objective.</Popover>}>
            <button className="toggle_button btn btn-primary btn-xs" onClick={this.onAddObjective}>
              Add
            </button>
          </OverlayTrigger> )
      : (<span/>);

    var commentsButton = (
      <button className='toggle_button btn btn-primary btn-xs' onClick={this.commentsButtonClicked}>Comments</button>
    );

    return (
      <div id="user-okr" className="user-okr">
        {editButton}
        {addObjective}
        {commentsButton}
        {objectives}
        <AddTag
          isOpen={this.state.addTagIsOpen}
          closeModal={this.closeAddTag}
          onSaveChanges={this.onTagsSave}
          data={this.state.addTagData}
        />
        <AddObjective
          isOpen={this.state.addObjectiveIsOpen}
          closeModal={this.closeObjective}
          onSave={this.onObjectiveSave}
        />
      </div>
    );
  }
});
