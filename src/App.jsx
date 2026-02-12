import { useState, useEffect } from 'react'
import './App.css'
import './index.css'
import * as Assets from './assets';

function App() {
  const [TimeLeft, setTimeLeft] = useState(25 * 60);
  const [IsRunning, setIsRunning] = useState(false);
  const [IsBreak, setIsBreak] = useState(false);
  const [encouragement, setEncouragement] = useState('');

  const cheerMessages = ["You Can Do It!", "I believe in you!", "You're amazing!", "Keep going!", "Stay focused!"];
  const breakMessages = ["Stay hydrated!", "Snacks, maybe!", "Text me!", "I love you <3", "Stretch your legs!"];

  // 1. Message Interval Logic
  useEffect(() => {
    let messageInterval = null;
    if (IsRunning) {
      const messages = IsBreak ? breakMessages : cheerMessages;
      setEncouragement(messages[Math.floor(Math.random() * messages.length)]);

      messageInterval = setInterval(() => {
        const currentMessages = IsBreak ? breakMessages : cheerMessages;
        setEncouragement(currentMessages[Math.floor(Math.random() * currentMessages.length)]);
      }, 5000);
    }
    return () => clearInterval(messageInterval);
  }, [IsRunning, IsBreak]);

  // 2. Main Timer Logic (Optimized)
  useEffect(() => {
    let interval = null;
    if (IsRunning && TimeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [IsRunning, TimeLeft]);

  // 3. Audio & Auto-Finish Logic
  useEffect(() => {
    if (TimeLeft === 0 && IsRunning) {
      setIsRunning(false);
      new Audio(Assets.meow).play().catch(e => console.log("Audio blocked"));
      
      // Auto-toggle to the other mode when timer ends
      // setIsBreak(!IsBreak);
      // setTimeLeft(!IsBreak ? 5 * 60 : 25 * 60);
    }
  }, [TimeLeft, IsRunning]);

  const minutes = Math.floor(TimeLeft / 60);
  const seconds = TimeLeft % 60;
  const formatTime = (time) => (time < 10 ? `0${time}` : time);

  // FIXED: SwitchMode now uses the new mode immediately for the timer
  const SwitchMode = (wantsBreak) => {
    setIsBreak(wantsBreak);
    setIsRunning(false);
    setTimeLeft(wantsBreak ? 5 * 60 : 25 * 60); 
  };

  const handleStart = () => {
    if (!IsRunning) {
      setIsRunning(true);
    } else {
      setIsRunning(false);
      // Reset to current mode's default time
      setTimeLeft(IsBreak ? 5 * 60 : 25 * 60);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Background changes based on Work/Break */}
      <div className={`home-container ${IsBreak ? 'break-theme' : 'work-theme'}`}>
        <button className='close-button' onClick={() => window.close()}>
          <img src={Assets.close} alt="close" />
        </button>

        <div className="home-content">
          <div className="home-control">
            {/* Logic: If NOT on break, show work-clicked icon */}
            <button className="image-button" onClick={() => SwitchMode(false)}>
              <img src={!IsBreak ? Assets.workClicked : Assets.workImg} alt="work" />
            </button>
            {/* Logic: If on break, show break-clicked icon */}
            <button className="image-button" onClick={() => SwitchMode(true)}>
              <img src={IsBreak ? Assets.breakClicked : Assets.breakImg} alt="break" />
            </button>
          </div>

          <p className={`encouragement-text ${IsRunning ? '' : 'hidden'}`}>
            {encouragement}
          </p>

          <h1 className="home-timer">
            {formatTime(minutes)}:{formatTime(seconds)}
          </h1>

          {/* GIF Logic: Idle when stopped, specific GIF when running */}
          <img 
            className="gif-image" 
            src={!IsRunning ? Assets.idle : (IsBreak ? Assets.breakGif : Assets.workGif)} 
            alt="cat-status" 
          />

          <button className="home-button" onClick={handleStart}>
            <img src={IsRunning ? Assets.reset : Assets.play} alt="play-control" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default App;