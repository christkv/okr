import React from 'react';
import {Button, ProgressBar} from 'react-bootstrap';
import ToogleButton from './toggle_button';
import Store from '../store';
import Objective from './okr/objective';
import co from 'co';
import AddTag from './okr/add_tag';

export default React.createClass({
  getInitialState: function() {
    return Store.OKR().getState();
  },

  // Component became visible
  componentDidMount: function() {
    var self = this;

    // Load the data
    co(function*() {
      // Load the user
      var user = yield Store.User().load();
      // Load the OKR for the proposed user viewed by the current user
      yield Store.OKR().load(self.props.params.userId, user);
      // Get the state
      self.setState(Store.OKR().getState());
    });
  },

  // Edit button clicked
  editButtonClicked: function(index) {
    var self = this;

    // Fire edit button clicked
    co(function*() {
      yield Store.OKR().dispatch({type: Store.OKR_EDIT_BUTTON_CLICKED, value: index});
      self.setState(Store.OKR().getState());
    });
  },

  // On objective Change
  onObjectiveChange: function(e) {
    var self = this;

    co(function*() {
      if(e.type == 'keyResultChange') {
        yield Store.OKR().dispatch({type: Store.OKR_CHANGED, value: e});
        self.setState(Store.OKR().getState());
      } else if(e.type == 'addKeyResultTag') {
        // Load the tags
        yield Store.Tags().load();
        // Set the modal controller to visible
        self.state.modalIsOpen = true;
        // Set the modal payload
        self.state.modalData = {
          id: e.keyResultId, type: 'keyResult', object: e.keyResult,
          text: e.keyResult.keyResult, tags: e.keyResult.tags,
          suggestions: Store.Tags().tags()
        }

        // Update the state
        self.setState(self.state);
      } else if(e.type == 'ratingChanged') {
        yield Store.OKR().dispatch({type: Store.OKR_RATING_CHANGED, value: e});
        self.setState(Store.OKR().getState());
      }
    });
  },

  // Tag changes
  onTagsSave: function(object) {
    if(object.type == 'keyResult') {
      object.object.tags = object.tags;
    } else if(object.type == 'objective') {

    }

    this.setState({
      modalIsOpen:false
    });
  },

  // Close modal
  closeModal: function(e) {
    this.setState({modalIsOpen:false});
  },

  // Render the okr component
  render: function() {
    var objectives = this.state.objectives.map((objective) => {
      return (
        <Objective key={objective.id}
            data={objective}
            edit={this.state.edit}
            rate={Store.OKR().canRate()}
            tags={objective.tags}
            onObjectiveChange={this.onObjectiveChange}
        />
      )
    });

    var editButton = Store.OKR().canEdit()
      ? ( <ToogleButton values={["edit", "save"]} onClick={this.editButtonClicked}/> )
      : ( <span/> );

    return (
      <div id="user-okr" className="user-okr">
        <h1>OKR</h1>
        {editButton}
        {objectives}
        <AddTag
          isOpen={this.state.modalIsOpen}
          closeModal={this.closeModal}
          onSaveChanges={this.onTagsSave}
          data={this.state.modalData}
        />
      </div>
    );
  }
});
