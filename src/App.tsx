import { useState, useEffect, useRef } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';

// --- GEMINI API HELPER ---
const fetchGemini = async (prompt: string, systemInstruction = "You are a sassy, helpful, and slightly mischievous desktop pixel pet. Keep answers brief (1-3 sentences max). Use cute emojis.") => {
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

// PIXEL ART ASSET GENERATOR
const generatePixelPet = (color: string, state: string, direction: string, lookDir: { x: number; y: number }) => {
  const pixelSize = 5;
  let pixels: React.ReactNode[] = [];
  
  const sprites: Record<string, number[][]> = {
    idle: [[0,0,1,1,0,0,0,1,1,0,0],[0,1,2,2,1,1,1,2,2,1,0],[1,2,2,2,2,2,2,2,2,2,1],[1,2,3,2,2,2,2,2,3,2,1],[1,2,2,2,1,1,1,2,2,2,1],[1,2,2,2,2,2,2,2,2,2,1],[0,1,2,2,2,2,2,2,2,1,0],[0,0,1,2,2,1,2,2,1,0,0],[0,0,1,1,1,0,1,1,1,0,0]],
    sit: [[0,0,0,0,0,0,0,0,0,0,0],[0,0,1,1,0,0,0,1,1,0,0],[0,1,2,2,1,1,1,2,2,1,0],[1,2,2,2,2,2,2,2,2,2,1],[1,2,3,2,2,2,2,2,3,2,1],[1,2,2,2,1,1,1,2,2,2,1],[0,1,2,2,2,2,2,2,2,1,0],[0,1,2,2,2,2,2,2,2,1,0],[0,1,1,1,1,1,1,1,1,1,0]],
    happy: [[0,0,1,1,0,0,0,1,1,0,0],[0,1,2,2,1,1,1,2,2,1,0],[1,2,2,2,2,2,2,2,2,2,1],[1,2,4,2,2,2,2,2,4,2,1],[1,2,2,5,1,1,1,5,2,2,1],[1,2,2,2,2,2,2,2,2,2,1],[0,1,2,2,2,2,2,2,2,1,0],[0,0,1,2,2,1,2,2,1,0,0],[0,0,1,1,1,0,1,1,1,0,0]],
    dizzy: [[0,0,1,1,0,0,0,1,1,0,0],[0,1,2,2,1,1,1,2,2,1,0],[1,2,2,2,2,2,2,2,2,2,1],[1,2,6,2,2,2,2,2,6,2,1],[1,2,2,2,1,4,1,2,2,2,1],[1,2,2,2,2,2,2,2,2,2,1],[0,1,2,2,2,2,2,2,2,1,0],[0,1,1,2,2,1,2,2,1,1,0],[0,0,1,1,1,0,1,1,1,0,0]],
    sleep: [[0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0],[0,0,1,1,0,0,0,1,1,0,0],[0,1,2,2,1,1,1,2,2,1,0],[1,2,2,2,2,2,2,2,2,2,1],[1,2,4,2,2,2,2,2,4,2,1],[1,2,2,2,2,2,2,2,2,2,1],[0,1,1,1,1,1,1,1,1,1,0]],
    walk: [[0,0,1,1,0,0,0,1,1,0,0],[0,1,2,2,1,1,1,2,2,1,0],[1,2,2,2,2,2,2,2,2,2,1],[1,2,3,2,2,2,2,2,3,2,1],[1,2,2,2,1,1,1,2,2,2,1],[1,2,2,2,2,2,2,2,2,2,1],[0,1,2,2,2,2,2,2,2,1,0],[0,1,1,1,0,0,0,1,1,1,0],[0,1,1,0,0,0,0,0,1,1,0]]
  };

  const currentSprite = sprites[state] || sprites.idle;
  
  currentSprite.forEach((row: number[], y: number) => {
    row.forEach((val: number, x: number) => {
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
  const appWindow = getCurrentWindow();
  
  const [petState, setPetState] = useState('fall'); 
  const [direction, setDirection] = useState('right');
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([{ role: 'pet', text: "Hey! Need something? 🐾" }]);
  const [chatInput, setChatInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [lookDir, setLookDir] = useState({ x: 0, y: 0 });
  const chatEndRef = useRef<HTMLDivElement>(null);

  const stateRef = useRef(petState);
  const isDraggingRef = useRef(false);
  const windowPos = useRef({ x: 500, y: 100 }); 
  const frameRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => { stateRef.current = petState; }, [petState]);

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isThinking, showChat]);

  // Track cursor position outside the application
  useEffect(() => {
    const trackMouse = (e: MouseEvent) => { mouseRef.current = { x: e.screenX, y: e.screenY }; };
    window.addEventListener('mousemove', trackMouse);
    return () => window.removeEventListener('mousemove', trackMouse);
  }, []);

  //PHYSICS ENGINE & MOVEMENT LOOP 
  useEffect(() => {
    const fps = 60;
    let velocityY = 0;

    appWindow.outerPosition().then(pos => {
      windowPos.current = { x: pos.x, y: pos.y };
    }).catch(() => {});

    const interval = setInterval(() => {
      if (isDraggingRef.current || showChat) {
          frameRef.current++;
          return;
      }

      let newX = windowPos.current.x;
      let newY = windowPos.current.y;
      
      const groundLevel = window.screen.availHeight - 150; 
      const isFalling = newY < groundLevel;

      if (isFalling) {
        velocityY += 0.5; 
        if (!['fall', 'zoomies'].includes(stateRef.current)) setPetState('fall');
      } else {
        if (stateRef.current === 'fall' && Math.abs(velocityY) > 12) {
          setPetState('squashed');
          setTimeout(() => { if (stateRef.current === 'squashed') setPetState('idle'); }, 500);
        } else if (stateRef.current === 'fall') {
          setPetState('idle'); 
        }
        velocityY = 0;
        newY = groundLevel;
      }

      // Movement Calculations
      if (['walk', 'run_away', 'zoomies'].includes(stateRef.current)) {
        let speed = stateRef.current === 'zoomies' ? 12 : stateRef.current === 'run_away' ? 6 : 1.5;
        newX += direction === 'right' ? speed : -speed;

        if (newX <= 0) { newX = 0; setDirection('right'); }
        else if (newX >= window.screen.availWidth - 150) { newX = window.screen.availWidth - 150; setDirection('left'); }
      }

      newY += velocityY;
      
      if (newX !== windowPos.current.x || newY !== windowPos.current.y) {
        windowPos.current = { x: newX, y: newY };
        appWindow.setPosition({ x: newX, y: newY } as any).catch(() => {}); 
      }

      // Global Eye Tracking Math
      const dx = mouseRef.current.x - (newX + 75); 
      const dy = mouseRef.current.y - (newY + 75); 
      const distance = Math.sqrt(dx * dx + dy * dy);
      let newLookX = 0;
      let newLookY = 0;
      
      if (!['sleep', 'happy', 'dizzy', 'squashed'].includes(stateRef.current)) {
        if (distance > 30) {
          newLookX = Math.abs(dx) > 40 ? Math.sign(dx) : 0;
          newLookY = Math.abs(dy) > 40 ? Math.sign(dy) : 0;
        }
      }
      setLookDir({ x: newLookX, y: newLookY });

      frameRef.current++;
    }, 1000 / fps);

    return () => clearInterval(interval);
  }, [direction, showChat]);

  // --- NEW ADVANCED BRAIN (Frequent/Fun Actions) ---
  useEffect(() => {
    const brain = setInterval(() => {
      // Don't interrupt important states
      if (isDraggingRef.current || showChat || ['fall', 'squashed', 'dizzy'].includes(stateRef.current)) return;
      
      const rand = Math.random();

      if (stateRef.current === 'sleep') {
        if (rand < 0.3) setPetState('sit'); // Wake up
      } else {
        if (rand < 0.10) {
          setPetState('zoomies');
          setDirection(Math.random() > 0.5 ? 'right' : 'left');
          setTimeout(() => { if(stateRef.current === 'zoomies') setPetState('idle'); }, 3000);
        } else if (rand < 0.35) {
          setPetState('walk');
          setDirection(Math.random() > 0.5 ? 'right' : 'left');
        } else if (rand < 0.55) {
          setPetState('sit');
        } else if (rand < 0.75) {
          setPetState('idle');
        } else {
          setPetState('sleep');
        }
      }
    }, 4000); // Decides a new action dynamically every 4 seconds!
    return () => clearInterval(brain);
  }, [showChat]);

  // EMINI ACTIONS 
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setPetState('sit'); 
    
    const newMessages = [...chatMessages, { role: 'user', text: chatInput }];
    setChatMessages(newMessages);
    setChatInput('');
    setIsThinking(true);

    const responseText = await fetchGemini(chatInput);
    
    setPetState('happy');
    setTimeout(() => {
      if (stateRef.current === 'happy') setPetState('sit');
    }, 2000);

    setChatMessages([...newMessages, { role: 'pet', text: responseText || '' }]);
    setIsThinking(false);
  };

  const handleMouseUp = async () => {
    isDraggingRef.current = false;
    setPetState('fall');
    try {
      const pos = await appWindow.outerPosition();
      windowPos.current = { x: pos.x, y: pos.y };
    } catch (e) { console.error(e); }
  };

  const handleDoubleClick = async () => {
    const isOpening = !showChat;
    setShowChat(isOpening);
    
    if (isOpening) {
      await appWindow.setSize({ width: 350, height: 450 } as any);
      await appWindow.setPosition({ x: windowPos.current.x, y: windowPos.current.y - 300 } as any);
    } else {
      await appWindow.setSize({ width: 150, height: 150 } as any);
      await appWindow.setPosition({ x: windowPos.current.x, y: windowPos.current.y + 300 } as any);
    }
  };

  return (
    <div className="w-full h-full bg-transparent overflow-hidden select-none relative flex items-end">
      
      {/* THE PET */}
      <div 
        data-tauri-drag-region="true"
        className="w-[150px] h-[150px] cursor-grab active:cursor-grabbing z-50 drop-shadow-xl relative flex justify-center items-center"
        style={{
            transform: `
              translateY(${['walk', 'zoomies'].includes(petState) ? Math.sin(frameRef.current * 0.5) * 4 : 0}px)
              scale(${petState === 'squashed' ? '1.5, 0.4' : petState === 'happy' ? '1.05, 1.05' : '1, 1'})
              scaleY(${petState === 'sleep' ? 1 + Math.sin(frameRef.current * 0.05) * 0.05 : 1})
              rotate(${petState === 'dizzy' ? Math.sin(frameRef.current * 0.3) * 15 : petState === 'fall' ? 5 : 0}deg)
            `,
            transition: petState === 'sleep' ? 'transform 0.5s ease-in-out' : 'transform 0.1s linear'
        }}
        onMouseDown={() => { isDraggingRef.current = true; setPetState('drag'); }}
        onMouseUp={handleMouseUp}
        onDoubleClick={handleDoubleClick}
      >
        <div data-tauri-drag-region="true" className="w-[100px] h-[100px] pointer-events-none">
           {generatePixelPet('#3b82f6', ['zoomies'].includes(petState) ? 'walk' : petState, direction, lookDir)}
        </div>
        
        {petState === 'zoomies' && <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-white/80 text-xl font-bold animate-pulse tracking-widest italic drop-shadow-md pointer-events-none">ZOOM!</div>}
        {petState === 'sleep' && <div className="absolute -top-4 left-1/2 text-white/80 font-bold text-sm animate-bounce pointer-events-none">Zzz...</div>}
        {petState === 'happy' && <div className="absolute -top-4 right-2 text-pink-400 text-xl animate-bounce pointer-events-none">♥</div>}
      </div>

      {/* CHAT INTERFACE */}
      {showChat && (
        <div className="absolute top-0 right-0 bg-white/30 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl w-[320px] h-[430px] flex flex-col p-4 z-40 m-2">
           <div className="flex justify-between items-center border-b border-white/20 pb-2 mb-2">
              <h2 className="font-bold text-white shadow-sm">✨ Pet Brain</h2>
              <button onClick={handleDoubleClick} className="text-red-400 font-bold hover:text-red-500">✕ Close</button>
           </div>
           
           <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
             {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
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

           <form onSubmit={handleSendMessage} className="mt-3 flex gap-2 pt-2 border-t border-white/20">
             <input 
                type="text" 
                value={chatInput} 
                onChange={e => setChatInput(e.target.value)} 
                className="flex-1 bg-white/80 text-black rounded-xl px-3 py-2 text-sm outline-none shadow-inner" 
                placeholder="Talk to your pet..." 
                disabled={isThinking}
             />
             <button type="submit" disabled={!chatInput.trim() || isThinking} className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl px-4 py-2 font-bold">↑</button>
           </form>
        </div>
      )}
    </div>
  );
}