import { Routes, Route } from "react-router-dom";

import Layout from './components/Layout';
import Home from './components/Home';
import TodoList from './components/TodoList';
import Disclaimer from "./components/Disclaimer";
import NotFound from './components/NotFound';

import './App.css';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/todos" element={<TodoList />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
