import './App.css';
import { Perf } from 'r3f-perf';
import { OrbitControls } from '@react-three/drei';
import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { Canvas } from "react-three-fiber"
import Square from './components/Square.js';

const Button = styled.button`
  position: fixed;
  z-index: 20;
  top: 0;
  left: 0;
`;


function App() {
  const [playSound, setPlaySound] = useState(false);
  const sound = useRef();

  useEffect(() => {
    if (sound.current) {
      sound?.current?.play();
    }
  }, [playSound])

  return (
    <>
      <Button onClick={() => setPlaySound(old => !old)}>Play Sound</Button>
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls autoRotate={true}/>
        <Square playSound={playSound} sound={sound}/>
        <Perf />
      </Canvas>
    </>
  );
}

export default App;
