import React, { Component } from "react";
import TodoItem from "../TodoItem/todoItem";
import "./todoList.css";
import AddIcon from "@material-ui/icons/Add";

class TodoList extends Component {
  constructor() {
    super();
    let today = new Date();
    let date =
      (today.getDate() < 10 ? "0" + today.getDate() : today.getDate()) +
      "/" +
      (today.getMonth() + 1 < 10
        ? "0" + (today.getMonth() + 1)
        : today.getMonth() + 1);
    this.state = {
      date: date,
      todo: "",
    };
  }

  _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.submitTodo(e);
    }
  }

  render() {
    const { todos } = this.props;
    return (
      <div className="todoListContainer">
        <h3 className="header">Todo List - {this.state.date}</h3>
        <div
          style={{
            textAlign: "left",
            justifyContent: "left",
            borderBottom: "1px solid #00000023",
            margin: "10px",
          }}
        >
          <input
            type="text"
            ref="myInput"
            id="addTodoInput"
            style={{
              border: "none",
              background: "transparent",
              textAlign: "left",
              alignItems: "left",
              width: "90%",
              padding: '5px',
            }}
            onChange={(e) => this.updateInput(e)}
            onKeyDown={this._handleKeyDown}
            placeholder="What are you planning to do?"
          />
          <AddIcon
            style={{
              float: "right",
              color: "grey",
              marginRight: "5px",
              cursor: "pointer",
            }}
            onClick={(e) => this.submitTodo(e)}
          ></AddIcon>
        </div>

        {todos.map((_todo, _index) => {
          return (
            <TodoItem
              removeTodoFn={(_) => this.props.removeTodo(_)}
              updateTodoFn={(_) => this.props.updateTodo(_)}
              key={_index}
              todo={_todo}
            ></TodoItem>
          );
        })}
      </div>
    );
  }
  updateInput = (e) => {
    this.setState({
      todo: e.target.value,
    });
  };
  submitTodo = (e) => {
    e.preventDefault();
    if (this.state.todo !== "") {
      this.props.addTodoFn(this.state.todo);
    }
    this.setState({
      todo: "",
    });
    document.getElementById("addTodoInput").value = "";
  };
  updateTodo = (todo) => {
    this.props.updateTodoFn(todo);
  };
  removeTodo = (todo) => {
    this.props.removeTodoFn(todo);
  };
}

export default TodoList;
