
import { PositionalAudio, shaderMaterial} from '@react-three/drei';
import React, { Suspense, useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import * as THREE from "three"
import { extend, useFrame } from "react-three-fiber"
// import { shaderMaterial } from "drei"
import glsl from "babel-plugin-glsl/macro"


const MorphMaterial = shaderMaterial(
  { 
    time: 0, 
    color: new THREE.Color(0.2, 0.0, 0.1),
    frequency: 0,
    translateZ: new THREE.Vector3(0.0,0.0,0.0),
  },
  // the tag is optional, it allows the VSC to syntax highlibht and lint glsl,
  // also allows imports and other things
  glsl`
    uniform float frequency;
    uniform vec3 translateZ;
    varying vec2 vUv;

    void main() {
      vUv = uv;
      vec3 newVector = translateZ * frequency;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( vec3(position) + newVector, 1.0);
    }`,
  glsl`
    uniform float time;
    uniform vec3 color;
    varying vec2 vUv;
    void main() {
      gl_FragColor.rgba = vec4(0.5 + 0.3 * sin(vUv.yxx + time) + color, 1.0);
    }`
)

extend({ MorphMaterial })


function Square({playSound, sound}) {
 
  const squareRef = useRef(Array.from(Array(81), () => React.createRef()));
  let vectors = [...Array.from(Array(81), () => new THREE.Vector3(0.0,0.0,Math.random()))];

  const [analyser, setAnalyser] = useState(null);

  useFrame(({clock, camera}) => {
    // console.log({ref})
    squareRef.current.forEach((refItem, index) => {
        if (refItem.current) {
          if ( analyser) {
            const data = analyser.getAverageFrequency();
 
            if (data) {
              refItem.current.material.frequency = ((data / 30) * 2);
              refItem.current.material.translateZ = vectors[index];
            }
        }
        
        }
      })
    
  })

  useEffect(
    () =>{
      if (sound.current) {
        // console.log({sound})
       
          setAnalyser(new THREE.AudioAnalyser(sound.current, 32));
        
      }
    },
    [sound, playSound]
  );

  function generateDarkColorHex() {
    let color = "#";
    for (let i = 0; i < 3; i++)
      color += ("0" + Math.floor(Math.random() * Math.pow(16, 2) / 2).toString(16)).slice(-2);
    return color;
  }


  return (
  
      <Suspense fallback={null}>
         <group position={[0,0,0]}>
           {[
             [1.0, 1.0],[1.0, 2.0],[1.0,3.0],[1.0, 4.0],[1.0, 5.0],[1.0,6.0],[1.0, 7.0],[1.0, 8.0],[1.0,9.0],
             [2.0, 1.0],[2.0,2.0], [2.0,3.0], [2.0, 4.0],[2.0,5.0], [2.0,6.0], [2.0, 7.0],[2.0,8.0], [2.0,9.0],
             [3.0,1.0], [3.0,2.0], [3.0,3.0], [3.0,4.0], [3.0,5.0], [3.0,6.0], [3.0,7.0], [3.0,8.0], [3.0,9.0],
             [4.0, 1.0],[4.0, 2.0],[4.0,3.0],[4.0, 4.0],[4.0, 5.0],[4.0,6.0], [4.0, 7.0],[4.0, 8.0],[4.0,9.0],
             [5.0, 1.0],[5.0,2.0], [5.0,3.0], [5.0, 4.0],[5.0,5.0], [5.0,6.0], [5.0, 7.0],[5.0,8.0], [5.0,9.0], 
             [6.0,1.0], [6.0,2.0], [6.0,3.0], [6.0,4.0], [6.0,5.0], [6.0,6.0], [6.0,7.0], [6.0,8.0], [6.0,9.0],
             [7.0,1.0], [7.0,2.0], [7.0,3.0], [7.0,4.0], [7.0,5.0], [7.0,6.0], [7.0,7.0], [7.0,8.0], [7.0,9.0],
             [8.0,1.0], [8.0,2.0], [8.0,3.0], [8.0,4.0], [8.0,5.0], [8.0,6.0], [8.0,7.0], [8.0,8.0], [8.0,9.0],
             [9.0,1.0], [9.0,2.0], [9.0,3.0], [9.0,4.0], [9.0,5.0], [9.0,6.0], [9.0,7.0], [9.0,8.0], [9.0,9.0],
            ].map((item, index) => {
             const color = new THREE.Color( 0xffffff );
             color.setHex( generateDarkColorHex() );
             return (
              <mesh ref={squareRef.current[index]} position={[item[1] - 4.9, item[0] -4.5, 1.0]}>
              <boxBufferGeometry attach="geometry" />
              <morphMaterial attach="material" color={color} />
              {index === 15 && <PositionalAudio url="Benjamin-Francis-Leftwich-1904-(Manila-Killa-Remix).mp3" ref={sound} isPlaying={playSound}/>}
          
              </mesh>
           
             )
           })}
          </group>
          <gridHelper args={[10,10,10]} />
        {/* // <mesh ref={ref}>
        //   <boxBufferGeometry attach="geometry" />
        //   <morphMaterial attach="material" color="#203050" />
          
       
        
        
        
          
        // </mesh> */}
      </Suspense>
     
  );
}

export default Square;