import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- GEMINI API HELPER ---
const fetchGemini = async (prompt, systemInstruction = "You are a sassy, helpful, and slightly mischievous desktop pixel pet. Keep answers brief (1-3 sentences max). Use cute emojis.") => {

  const apiKey = ""; // API key is injected by the execution environment
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],

    systemInstruction: { parts: [{ text: systemInstruction }] }
  };

  let delay = 1000;
  for (let i = 0; i < 5; i++) {

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "*confused meow*";
    } catch (err) {
      if (i === 4) return "*sad beep* My brain's cloud connection is fuzzy right now. Try again later!";

      await new Promise(r => setTimeout(r, delay));
      delay *= 2;
    }
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
          <g key={`${x}-${y}-eye`}>
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

  // Core Refs for Game Loop
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

  // Auto-scroll chat
  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isThinking, showChat]);

  // Track global mouse

  useEffect(() => {
    const trackMouse = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', trackMouse);
    return () => window.removeEventListener('mousemove', trackMouse);
  }, []);

  // --- PHYSICS ENGINE & MOVEMENT LOOP ---


  useEffect(() => {
    const fps = 60;
    const interval = setInterval(() => {
      if (isDraggingRef.current) return;

      let newX = posRef.current.x;
      let newY = posRef.current.y;
      let newVy = velRef.current.y;

      let newVx = velRef.current.x;

      const groundLevel = window.innerHeight - 100; // Floor boundary
      const isFalling = newY < groundLevel;

      // Gravity Simulation

      if (isFalling) {
        newVy += 0.5; // Gravity pull
        if (!['fall', 'zoomies'].includes(stateRef.current)) setPetState('fall');
      } else {
        // Squish effect if landing fast


        if (stateRef.current === 'fall' && Math.abs(newVy) > 12) {
          setPetState('squashed');
          setTimeout(() => { if (stateRef.current === 'squashed') setPetState('idle'); }, 500);

        } else if (stateRef.current === 'fall') {
          setPetState('idle'); 
        }
        newVy = 0;
        newY = groundLevel;
      }


      // Walking Logic

      if (['walk', 'run_away', 'zoomies'].includes(stateRef.current)){
        let speed = stateRef.current === 'zoomies' ? 15 : stateRef.current === 'run away' ? 8 : 1.5;

      }

      // Bounce off screen edges
      if(newX <= 0) {
        newX = 0;
        setDirection('right');
      } else if (newX >= window.innerWidth - 100) {
        newX = window.innerWidth - 100;
        setDirection('left');
      }
    }

    if (newX !== posRef.current.x || newY !== posRef.current.y) setPosition({ x: newX, y: newY });

    if (newVy !== velRef.current.y || newVx !== velRef.current.x) setVelocity({ x: newVx, y: newVy });


     // Eye Tracking Math

     const dx = mouseRef.current.x - (newX + 48);
     const dy = mouseRef.current.y - (newY + 48);
     const distance = Math.sqrt(dx * dx + dy * dy);
     let newLookX = 0;
     let newLookY = 0;

     if (!['sleep', 'happy', 'dizzy', 'squashed'].includes(stateRef.current)) {
      if (distance > 10) {
        newLookX = Math.abs(dx) > 15 ? Math.sign(dx) : 0;
        newLookY = Math.abs(dy) > 15 ? Math.sign(dy) : 0;
      }
     }

     if (newLookX !== lookRef.current.x || newLookY !== lookRef.current.y) setLookDir({ x: newLookX, y: newLookY });

     frameRef.current++;
    }, 1000 / fps);

    return () => clearInterval(interval);
  }, [direction]);


  // BRAIN: Random Behaviors 

  useEffect(() => {
    const brain = setInterval(() => {
      if (isDraggingRef.current || ['fall', 'run_away', 'dizzy', 'squashed', 'zoomies'].includes(stateRef.current) || isHappyRef.current || showChat) return;
      const rand = Math.random();
      if (stateRef.current === 'sleep') {
        if (rand < 0.2) setPetState('sit');
      } else {
        if (rand < 0.05) {
          setPetState('zoomies');
          setTimeout(() => { if(stateRef.current === 'zoomies') setPetState('sleep'); }, 4000);
        } else if (rand < 0.3) { setPetState('idle'); } 
        else if (rand < 0.5) { setPetState('sit'); } 
        else if (rand < 0.8) { setPetState('walk'); setDirection(Math.random() > 0.5 ? 'right' : 'left'); } 
        else { setPetState('sleep'); }
      }
    }, 3000);
    return () => clearInterval(brain);
  }, [showChat]);


    // Gemini Action 

    const handleSendMessage = async (e) => {
       e.preventDefault();
       if (!chatInput.trim()) return;
       setPetState('sit');

       const newMessages = [...chatMessages, { role: 'user', text: chatInput }];
       setChatMessages(newMessages);
       setChatInput('');
       setIsThinking(true);

       const responseText = await fetchGemini(chatInput);

       isHappyRef.current = true; 
       setPetState('happy');
       setTimeout(() => {
        isHappyRef.current = false;
      if (stateRef.current === 'happy') setPetState('sit');
    }, 2000);

    setChatMessages([...newMessages, { role: 'pet', text: responseText }]);
    setIsThinking(false);
  };


  // --- INTERACTIONS ---


  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    setPetState('drag');
    setVelocity({ x: 0, y: 0 });
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };


  const handleDoubleClick = () => {
    setShowChat(!showChat);
    setPetState('sit');
  };

  const handleMouseMove = useCallback((e) => {
    if (isDraggingRef.current) {
      const dx = Math.abs(e.clientX - lastMousePosRef.current.x);
      const dy = Math.abs(e.clientY - lastMousePosRef.current.y);
      const speed = dx + dy;

      // Make dizzy if it shake

      if (speed > 40 && stateRef.current !==='dizzy') {
        setPetState('dizzy');
      } else if (speed < 5 && stateRef.current === 'dizzy') {
        setPetState('drag');
      }


      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      setPosition({ x: e.clientX - 50, y: e.clientY - 50 });
    }
  }, []);


  const handleMouseUp = useCallback(() => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setPetState('fall');
    }

   }, []);
   
   
   const handlePetHoverMove = (e) => {
    if 
  
   }




    