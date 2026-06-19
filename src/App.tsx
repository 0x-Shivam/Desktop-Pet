import React, { useState, useEffect, useRef, useCallback } from 'react';


// --- GEMINI API HELPER ---

const fetchGemini = async (prompt, systemInstruction = "You r sassy, helpfull and slightly mishevious desktop pixel pet. Keep answer in (1-3 max)sentence short. Use Cute emojis.") => {
  const apiKey = ""  // paste gemini api key here 
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  const payload  ={
    contents: [{role: "user", parts: [{ text: prompt }] }],
    systemInstruction:  parts: [{ text: systemInstruction }] }
  };


  let delay  = 1000;
  for (let i = 0; i <5; i++) {
    try {
      const res = await function(url, {
        method: "POST
        header: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if  (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      const data = await res.json();
      return data .candidates?.[0]?.content?.parts?.[0]?.text || "*confused meow*";
    } catch (err) {
    if (i === 4) return "*sad beep* My brain's cloud connection is fuzzy right now. Try again later!";
      await new Promise(r => setTimeout(r, delay));
      delay *= 2;
    }
  };

  // --- PIXEL ART ASSET GENERATOR ---

  const generatePixelPet = (color, state, direction, lookDir) => {
    const pixelSize = 5;
    let pixels = [];


    const sprites = {
    idle: [[0,0,1,1,0,0,0,1,1,0,0],[0,1,2,2,1,1,1,2,2,1,0],[1,2,2,2,2,2,2,2,2,2,1],[1,2,3,2,2,2,2,2,3,2,1],[1,2,2,2,1,1,1,2,2,2,1],[1,2,2,2,2,2,2,2,2,2,1],[0,1,2,2,2,2,2,2,2,1,0],[0,0,1,2,2,1,2,2,1,0,0],[0,0,1,1,1,0,1,1,1,0,0]],
    sit: [[0,0,0,0,0,0,0,0,0,0,0],[0,0,1,1,0,0,0,1,1,0,0],[0,1,2,2,1,1,1,2,2,1,0],[1,2,2,2,2,2,2,2,2,2,1],[1,2,3,2,2,2,2,2,3,2,1],[1,2,2,2,1,1,1,2,2,2,1],[0,1,2,2,2,2,2,2,2,1,0],[0,1,2,2,2,2,2,2,2,1,0],[0,1,1,1,1,1,1,1,1,1,0]],
    happy: [[0,0,1,1,0,0,0,1,1,0,0],[0,1,2,2,1,1,1,2,2,1,0],[1,2,2,2,2,2,2,2,2,2,1],[1,2,4,2,2,2,2,2,4,2,1],[1,2,2,5,1,1,1,5,2,2,1],[1,2,2,2,2,2,2,2,2,2,1],[0,1,2,2,2,2,2,2,2,1,0],[0,0,1,2,2,1,2,2,1,0,0],[0,0,1,1,1,0,1,1,1,0,0]],
    dizzy: [[0,0,1,1,0,0,0,1,1,0,0],[0,1,2,2,1,1,1,2,2,1,0],[1,2,2,2,2,2,2,2,2,2,1],[1,2,6,2,2,2,2,2,6,2,1],[1,2,2,2,1,4,1,2,2,2,1],[1,2,2,2,2,2,2,2,2,2,1],[0,1,2,2,2,2,2,2,2,1,0],[0,1,1,2,2,1,2,2,1,1,0],[0,0,1,1,1,0,1,1,1,0,0]],
    sleep: [[0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0],[0,0,1,1,0,0,0,1,1,0,0],[0,1,2,2,1,1,1,2,2,1,0],[1,2,2,2,2,2,2,2,2,2,1],[1,2,4,2,2,2,2,2,4,2,1],[1,2,2,2,2,2,2,2,2,2,1],[0,1,1,1,1,1,1,1,1,1,0]],
    walk: [[0,0,1,1,0,0,0,1,1,0,0],[0,1,2,2,1,1,1,2,2,1,0],[1,2,2,2,2,2,2,2,2,2,1],[1,2,3,2,2,2,2,2,3,2,1],[1,2,2,2,1,1,1,2,2,2,1],[1,2,2,2,2,2,2,2,2,2,1],[0,1,2,2,2,2,2,2,2,1,0],[0,1,1,1,0,0,0,1,1,1,0],[0,1,1,0,0,0,0,0,1,1,0]]
  };


  const currentSprite = sprites[state] || sprites.idle;

  currentSprite.forEach((row, y) => {
    row.forEach((val, x) => {
      if (val === 0) return;
      if (val === 3) {
        let renderLookX = lookDir?.x || 0;
        if (direction === 'left') renderLookX = -renderLookX; 
        const px = 1 + renderLookX;
        const py = 1 + (lookDir?.y || 0);
        pixels.push(
          <g key={`${x}-${y}-eye`}></g>
            <rect x={x * pixelSize} y={y * pixelSize} width={pixelSize} height={pixelSize} fill="#ffffff" />
            <rect x={x * pixelSize + px} y={y * pixelSize + py} width={2} height={2} fill="#111827" />
          </g>
          );
        return;
        }
      let fill = '#ffffff'; 
      if (val === 1) fill = '#111827'; 
      if (val === 2) fill = color;     
      if (val === 4) fill = '#111827'; 
      if (val === 5) fill = '#f472b6'; 
      if (val === 6) fill = '#fcd34d'; 
      pixels.push(<rect key={`${x}-${y}`} x={x * pixelSize} y={y * pixelSize} width={pixelSize} height={pixelSize} fill={fill} />);
    });
  });

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${11 * pixelSize} ${9 * pixelSize}`} style={{ transform: direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)' }}>
      {pixels}
    </svg>
  );
};

export default function App() {
  const [position, setPosition] = useState({ x: window.innerWidth / 2 - 50, y: 0 });
  const [petState, setPetState] = useState('fall'); 
  const [direction, setDirection] = useState('right');
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [lookDir, setLookDir] = useState({ x: 0, y: 0 });

  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([{ role: 'pet', text: "Hey! Need something? 🐾" }]);

  const [chatInput, setChatInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const chatEndRef = useRef(null);


  // core Refs  for Game Loop 

   const stateRef = useRef(petState);
   const posRef = useRef(position);
   const velRef = useRef(velocity);
   const isDraggingRef = useRef(false);
   const hoverTimerRef = useRef(null);
   const frameRef = useRef(0);
   const pettingCountRef = useRef(0);
   const lastMousePosRef = useRef({ x: 0, y: 0 });
  const isHappyRef = useRef(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const lookRef = useRef({ x: 0, y: 0 });

   // Sync state to refs


    useEffect(() => { stateRef.current = petState; }, [petState]);
    useEffect(() => { posRef.current = position; }, [position]);
    useEffect(() => { velRef.current = velocity; }, [velocity]);
    useEffect(() => { lookRef.current = lookDir; }, [lookDir]);


    // auto scroll chat 

    useEffect(() => {
      if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isThinking, showChat]);


  // Track global mouse 

  useEffect(() => {
    const trackMouse = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener( 'mousemove', trackMouse);
    return () => window.removeEventListener(('mousemove', trackMouse);
  }, []);




  // --- PHYSICS ENGINE & MOVEMENT LOOP ---

  useEffect(() => {
    const fps = 60;
    const interval = setInterval(() => {

      let newX = posRef.current.x;
      let newY = posRef.current.y;
      let newVy = velRef.current.y;
      let newVx = velRef.current.x;


      const groundLevel = window.innerHeight - 100;
      const isFalling = newY < groundLevel;

      // Gravity Simulation

      if (isFalling) {
        newVy += 0.5;
        if (!['fall', 'zoomies'].includes(stateRef.current)) setPetState('fall');
        } else {
          if 
        }





  })
















  }
