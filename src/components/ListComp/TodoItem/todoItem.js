import React, { Component } from "react";
import "./todo.css";
import UseAnimations from "react-useanimations";

class TodoItem extends Component {
  render() {
    const { todo } = this.props;

    return (
      <div className="item">
        <div
          className={"todoItem" + (todo.completed ? " completed" : "")}
          onClick={(_) => this.toggleTodo(_)}
        >
          {todo.text}
        </div>
        <div>
          <UseAnimations
            animationKey="trash2"
            onClick={() => this.deleteTodo({ todo })}
            className="delete-icon"
          />
        </div>
        {/* <img
          src={delicon}
          alt=""
          onClick={() => this.deleteTodo({ todo })}
          className="delete-icon"
        /> */}
      </div>
    );
  }
  toggleTodo = () => {
    this.props.updateTodoFn(this.props.todo);
  };
  deleteTodo = (todo) => {
    this.props.removeTodoFn(this.props.todo);
  };
}

export default TodoItem;
