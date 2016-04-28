import React from 'react';
import {Button, ButtonToolbar, Image, Row, Col, Glyphicon} from 'react-bootstrap';
import LeftMenu from '../menu/left';
import TopMenu from '../menu/top';
import SearchBar from '../search';
import OKR from '../okr';
import List from '../comment/list';
import CommentForm from '../comment/form';
import {default as SideBar} from 'react-sidebar';
import Actions from '../../store/constants'
import {dispatch} from '../utils';
import co from 'co';

export default React.createClass({
  getInitialState: function() {
    return {
      edit: false,
      rate: true,

      sideBarOpen: false,
      _routePath: null,
      comments: [],
      user: {},
      manager: {}
    };
  },

  componentDidUpdate: function() {
    // Get the current path
    var newPath = this.props.location ? this.props.location.pathname : '';
    // Check if the path changed
    if(this.state._routePath !== newPath) {
      this.onRouteChanged({ _routePath: newPath });
    }
  },

  componentDidMount: function() {
    this.onRouteChanged({_routePath: this.props.location ? this.props.location.pathname : ''});
  },

  //
  // Component browser route changed, we need to refresh out data
  //
  onRouteChanged: function(state) {
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! onRouteChanged")
    var self = this;

    co(function*() {
      // Get the navigated to user
      var userId = self.props.params.userId;
      // Grab the user
      var user = yield self.props.store.User().load(userId);
      // Get the current user
      var currentUser = yield self.props.store.User().loadCurrent();

      // Are we in edit mode
      if(user.username == currentUser.username) {
        state = Object.assign(state, {edit: true, rate: false});
      }

      // Get the user okr
      var okr = yield self.props.store.OKR().load(user, currentUser);

      // Load all the tags
      var tags = yield self.props.store.Tags().load();

      // Update the state
      self.setState(Object.assign({
        user: user,
        currentUser: currentUser,
        okr: okr,
        tagSuggestions: tags.map((x) => { return x.text; })
      }, state));
    }).catch(function(e) {
      dispatch(self.props, Actions.ERROR, {error: e, context: {state: state, params: self.props.params}});
    });
  },

  //
  // All actions are dispatched through this handler
  //
  dispatch(event, message) {
    var self = this;

    co(function*() {
      console.log("+++++++++++++++++++++++ MAIN dispatch :: " + event)
      console.log(message)

      if(event == Actions.OKR_ADD_COMMENT) {
        // Locate the objective from the okr
        if(message.objective_id) {
          // Use the objective id to grab the comments
          var comments = yield self.props.store.Comment().loadObjectiveComments(message.objective_id);
          // Open the side bar with the comments for the objective
          return self.setState({ sideBarOpen: true, comments: comments, commentContext: { objective_id: message.objective_id } });
        } else {
          throw new Error('could not locate objective to comment on');
        }
      } else if(event == Actions.COMMENT_REPLY) {
        if(message.id && message.text && message.user && message.context
          && message.context.objective_id && !message.context.key_result_id) {
          // Message from the user
          var from = {
            avatar: message.user.avatar,
            username: message.user.username,
            name: message.user.name,
          };

          // Add the reply to the comment
          yield self.props.store.Comment()
            .addCommentReply(from, message.text, {
              _id: message.id,
              objective_id: message.context.objective_id
            });

          // Use the known comments to renew
          var comments = yield self.props.store.Comment().loadComments(message.comments.map(function(comment) {
            return comment._id
          }));

          // Open the side bar with the comments for the objective
          return self.setState({ comments: comments });
        }
      } else if(event == Actions.COMMENT_REPLY_EDIT) {
        if(message.id && message.comment_id && message.text && message.context
          && message.context.objective_id && !message.context.key_result_id) {
          // Add the reply to the comment
          yield self.props.store.Comment()
            .updateReply(message.comment_id, message.id, message.text);
          // Use the known comments to renew
          var comments = yield self.props.store.Comment().loadComments(message.comments.map(function(comment) {
            return comment._id
          }));
          // Open the side bar with the comments for the objective
          return self.setState({ comments: comments });
        }
      } else if(event == Actions.COMMENT_REPLY_DELETE) {
        // Add the reply to the comment
        yield self.props.store.Comment()
          .deleteReply(message.comment_id, message.id);
        // Use the known comments to renew
        var comments = yield self.props.store.Comment().loadComments(message.comments.map(function(comment) {
          return comment._id
        }));
        // Open the side bar with the comments for the objective
        return self.setState({ comments: comments });
      } else if(event == Actions.COMMENT_DELETE) {
        // Create a comment for the objective and then reload the current objective
        yield self.props.store.Comment().deleteComment(message.comment_id);
        // Use the known comments to renew
        var comments = yield self.props.store.Comment().loadComments(message.comments.map(function(comment) {
          return comment._id
        }));

        // Open the side bar with the comments for the objective
        return self.setState({ comments: comments });
      } else if(event == Actions.OKR_COMMENT_BUTTON_CLICKED) {
        if(self.state.okr) {
          // Get all the objectives
          var objectiveIds = self.state.okr.objectives.map(function(objective) {
            return objective._id;
          });
          // Use the objective id to grab the comments
          var comments = yield self.props.store.Comment().loadObjectiveComments(objectiveIds);
          // Open the side bar with the comments for the objective
          return self.setState({ sideBarOpen: true, comments: comments });
        }
      } else if(event == Actions.COMMENT_FORM_CANCEL) {
        return self.setState({ sideBarOpen: false });
      } else if(event == Actions.COMMENT_FORM_SUBMIT) {
        if(message.text && message.context
          && message.context.objective_id) {
          // From user
          var from = {
            avatar: message.user.avatar,
            username: message.user.username,
            name: message.user.name,
          };

          // Create a comment for the objective and then reload the current objective
          yield self.props.store.Comment().addComment(from, message.text, {
            objective_id: message.context.objective_id
          });

          // Use the objective id to grab the comments
          var comments = yield self.props.store.Comment().loadObjectiveComments(message.context.objective_id);
          // Open the side bar with the comments for the objective
          return self.setState({ sideBarOpen: true, comments: comments, commentContext: { objective_id: message.context.objective_id } });
        }
      } else if(event == Actions.COMMENT_EDIT) {
        if(message.comment_id && message.text && message.context
          && message.context.objective_id) {

          // Create a comment for the objective and then reload the current objective
          yield self.props.store.Comment().updateComment(message.comment_id, message.text);

          // Use the known comments to renew
          var comments = yield self.props.store.Comment().loadComments(message.comments.map(function(comment) {
            return comment._id
          }));
          // Open the side bar with the comments for the objective
          return self.setState({ sideBarOpen: true, comments: comments });
        }
      } else if(event == Actions.SEARCH_BAR_SUBMIT) {
        // If we have a user let's navigate to the users okr
        if(message.searchTerm
          && typeof message.searchTerm == 'object' && message.searchTerm.type == 'user') {
          dispatch(self.props, Actions.OKR_NAVIGATION_CHANGE, {type: message.searchTerm.type, username: message.searchTerm.username});
        } else {
          dispatch(self.props, Actions.ERROR, {error: new Error(`no user to team found for (${message.searchTerm})`), context: {event: event, message: message}});
        }
      } else {
        dispatch(self.props, event, message);
      }
    }).catch(function(e) {
      dispatch(self.props, Actions.ERROR, {error: e, context: {event: event, message: message}});
    });
  },

  onSearchChange: function(searchTerm, callback) {
    var self = this;

    co(function*() {
      // Search for the user/teams available
      var suggestions = yield self.props.store.Search().searchTeamAndUsers(searchTerm);
      // Return the suggestions
      callback(suggestions);
    }).catch(function(e) {
      dispatch(self.props, Actions.ERROR, {error: e, context: {searchTerm: searchTerm}});
    });
  },

  //
  // Render the component
  //
  render: function() {
    // Comment form
    var form = !this.state.comments || this.state.comments.length == 0
      ? ( <CommentForm
          user={this.state.user}
          context={this.state.commentContext}
          dispatch={this.dispatch}
        /> )
      : ( <span/> );

    // Side bar
    var sidebar = (
      <div className='sidebar'>
        <div  className='sidebar_btn_toolbar'>
          <ButtonToolbar>
            <Button onClick={() => { this.setState({ sideBarOpen: false }); }} bsSize='small'>
              <Glyphicon glyph="align-left" />
            </Button>
          </ButtonToolbar>
        </div>
        {form}
        <List
          comments={this.state.comments}
          user={this.state.user}
          context={this.state.commentContext}
          dispatch={this.dispatch}
        />
      </div>
    );

    // Render the main OKR view
    return (
      <SideBar
        pullRight={true}
        sidebar={sidebar}
        open={this.state.sideBarOpen}
        onSetOpen={() => { this.setState({ sideBarOpen: false }); }}
      >
        <div className='mainContainer'>
          <TopMenu
            user={this.state.user}
          />
          <Row>
            <Col md={2}>
              <LeftMenu
                user={this.state.user}
                manager={this.state.manager}
              />
            </Col>
            <Col md={10}>
              <Row>
                <SearchBar
                  label='Search'
                  disableButton={true}
                  placeholder='Search for user or team'
                  dispatch={this.dispatch}
                  onChange={this.onSearchChange}
                />
              </Row>
              <Row>
                <OKR
                  edit={this.state.edit}
                  rate={this.state.rate}
                  store={this.props.store}
                  currentUser={this.state.currentUser}
                  user={this.state.user}
                  okr={this.state.okr}
                  dispatch={this.dispatch}
                  tagSuggestions={this.state.tagSuggestions}
                />
              </Row>
            </Col>
          </Row>
        </div>
      </SideBar>
    );
  }
});
