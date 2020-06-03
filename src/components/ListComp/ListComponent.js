import React, { Component } from "react";
import TodoList from "./TodoList/todoList.js";
import firebase from "firebase";
import "./listComponent.css";
class ListComponent extends Component {
  constructor() {
    super();
    this.state = {
      todos: [],
      userID: null,
    };
  }

  render() {
    if (this.props.userID && this.props.user !== {}) {
      return (
        <div className="todo-list">
          <TodoList
            addTodoFn={(_) => this.addTodo(_)}
            updateTodo={(_) => this.updateTodo(_)}
            todos={this.state.todos}
            removeTodo={(_) => this.removeTodo(_)}
          />
        </div>
      );
    } else {
      return null;
    }
  }

  componentDidMount() {
    if (this.props.userID) {
      firebase
        .database()
        .ref("users")
        .child(this.props.userID)
        .child("todos")
        .once("value")
        .then((savedTodos) => {
          if (savedTodos.val()) {
            this.setState({
              todos: savedTodos.val(),
            });
          }
        });
    } else {
      setTimeout(() => {
        this.componentDidMount();
      }, 2500);
    }
  }

  addTodo = async (todo) => {
    await this.setState({
      todos: [
        ...this.state.todos,
        {
          text: todo,
          completed: false,
        },
      ],
    });
    firebase.database().ref("users").child(this.props.userID).update({
      todos: this.state.todos,
    });
  };

  updateTodo = async (todo) => {
    const newTodos = this.state.todos.map((_todo) => {
      if (todo === _todo)
        return {
          text: todo.text,
          completed: !todo.completed,
        };
      else return _todo;
    });
    await this.setState({
      todos: newTodos,
    });
    firebase.database().ref("users").child(this.props.userID).update({
      todos: this.state.todos,
    });
  };

  removeTodo = async (todo) => {
    const newTodos = this.state.todos.filter((item) => {
      return item !== todo;
    });
    await this.setState({
      todos: newTodos,
    });

    firebase.database().ref("users").child(this.props.userID).update({
      todos: this.state.todos,
    });
  };
}

export default ListComponent;
