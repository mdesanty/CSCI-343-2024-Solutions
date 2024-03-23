import { createSlice } from "@reduxjs/toolkit";

const todoSlice = createSlice({
  name: "todos",
  initialState: {
    todoList: []
  },
  reducers: {
    addTodo: (state, action) => {
      state.todoList.push(action.payload);
    },
    removeTodo: (state, action) => {
      state.todoList = state.todoList.filter((todo, index) => index !== action.payload);
    }
  }
});

const { actions, reducer } = todoSlice;
export const { addTodo, removeTodo } = actions;
export default reducer;