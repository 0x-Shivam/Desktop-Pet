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
      if (['walk', 'run_away', 'zoomies'].includes(stateRef.current)) {
        let speed = stateRef.current === 'zoomies' ? 15 : stateRef.current === 'run_away' ? 8 : 1.5;
        newX += direction === 'right' ? speed : -speed;

        // Bounce off screen edges
        if (newX <= 0) {
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

  // --- BRAIN: Random Behaviors ---
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

  // --- GEMINI ACTIONS ---
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
      
      // Make dizzy if shaken fast!
      if (speed > 40 && stateRef.current !== 'dizzy') {
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
    if (isDraggingRef.current || stateRef.current === 'run_away') return;
    const dx = Math.abs(e.movementX);
    const dy = Math.abs(e.movementY);
    if (dx > 2 || dy > 2) {
      pettingCountRef.current += 1;
      // Wiggle mouse over pet to make it happy
      if (pettingCountRef.current > 30 && !isHappyRef.current) {
        isHappyRef.current = true;
        setPetState('happy');
        pettingCountRef.current = 0; 
        setTimeout(() => {
          isHappyRef.current = false;
          if (stateRef.current === 'happy') setPetState('idle');
        }, 3000);
      }
    }
  };

  const handleMouseEnter = () => { pettingCountRef.current = 0; };
  const handleMouseLeave = () => { pettingCountRef.current = 0; };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div className="w-screen h-screen bg-transparent overflow-hidden select-none relative">
      
      {/* --- THE PET --- */}
      <div 
        className="absolute w-28 h-28 cursor-grab active:cursor-grabbing z-50 drop-shadow-xl"
        style={{ 
          left: position.x, 
          top: position.y,
          transform: `
            translateY(${['walk', 'zoomies'].includes(petState) ? Math.sin(frameRef.current * 0.5) * 4 : 0}px)
            scale(${petState === 'squashed' ? '1.5, 0.4' : petState === 'happy' ? '1.05, 1.05' : '1, 1'})
            scaleY(${petState === 'sleep' ? 1 + Math.sin(frameRef.current * 0.05) * 0.05 : 1})
            rotate(${petState === 'dizzy' ? Math.sin(frameRef.current * 0.3) * 15 : petState === 'fall' ? 5 : 0}deg)
          `,
          transition: petState === 'sleep' ? 'transform 0.5s ease-in-out' : 'transform 0.1s linear'
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handlePetHoverMove}
      >
        {petState === 'zoomies' && <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-white/80 text-xl font-bold animate-pulse tracking-widest italic drop-shadow-md pointer-events-none">ZOOM!</div>}
        {petState === 'sleep' && <div className="absolute -top-8 left-1/2 text-white/80 font-bold text-sm animate-bounce pointer-events-none">Zzz...</div>}
        {petState === 'happy' && <><div className="absolute -top-4 -left-2 text-pink-400 text-lg animate-ping pointer-events-none">♥</div><div className="absolute -top-8 right-0 text-pink-400 text-xl animate-bounce delay-75 pointer-events-none">♥</div></>}
        {petState === 'dizzy' && <div className="absolute -top-4 left-1/2 text-yellow-300 text-xl animate-spin pointer-events-none">✨</div>}
        
        {generatePixelPet('#3b82f6', ['run_away', 'zoomies'].includes(petState) ? 'walk' : ['fall', 'drag', 'squashed'].includes(petState) ? 'idle' : petState, direction, lookDir)}
      </div>

      {/* --- GEMINI CHAT INTERFACE --- */}
      {showChat && (
        <div 
          className="absolute bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl z-40 w-80 max-h-96 flex flex-col overflow-hidden"
          style={{ 
            left: Math.max(20, Math.min(position.x - 100, window.innerWidth - 340)), 
            bottom: window.innerHeight - position.y + 20 
          }}
        >
          <div className="bg-black/20 p-3 border-b border-white/10 flex justify-between items-center text-white">
            <h2 className="font-bold flex items-center gap-2">✨ Pet Brain</h2>
            <button onClick={() => setShowChat(false)} className="hover:text-red-400 font-bold px-2">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-black/10">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm font-medium ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-black rounded-bl-none shadow-md'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-white/70 text-black rounded-2xl rounded-bl-none px-4 py-2 text-sm animate-pulse">Thinking...</div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-3 bg-black/30 border-t border-white/10 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Talk to your pet..."
              className="flex-1 bg-white text-black placeholder-gray-500 rounded-xl px-3 py-2 text-sm outline-none shadow-inner"
              disabled={isThinking}
            />
            <button type="submit" disabled={!chatInput.trim() || isThinking} className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-xl px-4 py-2 font-bold transition-colors">
              ↑
            </button>
          </form>
        </div>
      )}
    </div>
  );
}


