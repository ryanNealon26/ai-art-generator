import InputBox from './components/inputBox';
import React, {useState} from "react";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
const backgroundImage = require('../src/generatorBackground.webp')
function App() {
  return (
    <div style={{backgroundImage: `url(${backgroundImage})`, height: '100vh', backgroundSize:'cover'}}>
      <h1 className='h1Text'>AI Art Generator</h1>
      <InputBox ></InputBox>
    </div>
  );
}

export default App;
