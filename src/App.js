import React from 'react';
import './styles/App.css';
import Header from './components/header.js';
import Title from './components/title.js';
import Table from './components/table.js';

function App() {
  return (
    <div className="App">
      <header>
        <Header />
      </header>
      <Title />
      <Table />
    </div>
  );
}

export default App;
