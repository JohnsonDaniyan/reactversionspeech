import logo from './logo.svg';
import './App.css';
import styles from './styles/Home.module.css'
import { Promise } from 'bluebird';
import { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

function App() {

  const [query, setQuery] = useState(null);
  useEffect(()=>{
    
    navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
     
    if (navigator.vibrate) {
	    // vibration API supported
      console.log("suported")
    navigator.vibrate(1000); 
    }
  },[]) 


 
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();
console.log({browserSupportsSpeechRecognition})
  
    var info, morseCode, playMorseCode, playMorseStr, sleep, start;
  
    info = function(msg) {
      console.log(msg);
    };
  
    morseCode = {
      A: ".-",
      B: "-...", 
      C: "-.-.",
      D: "-..",
      E: ".",
      F: "..-.",
      G: "--.",
      H: "....",
      I: "..",
      J: ".---",
      K: "-.-",
      L: ".-..",
      M: "--",
      N: "-.",
      O: "---",
      P: ".--.",
      Q: "--.-",
      R: ".-.",
      S: "...",
      T: "-",
      U: "..-",
      V: "...-",
      W: ".--",
      X: "-..-",
      Y: "-.--",
      Z: "--.."
    };
  
    sleep = function(msec) {
      return new Promise(function(resolve) {
        return setTimeout(function() {
          return resolve();
        }, msec); 
      });
    }; 
  
    playMorseStr = function(str) {
      return Promise.each(str.split(''), function(c) {
        return playMorseCode(c).then(function() {
          return sleep(1000);
        });
      });
    };
  
    playMorseCode = function(code) {
      // console.log({code})
      return new Promise(function(resolve, reject) {
        var pattern;
        if (code.length !== 1) {
          return reject("\"" + code + "\".length must be 1");
        }
        if (!/^[a-z]$/i.test(code)) {
          return reject("\"" + code + "\": A-Z is ok");
        }
        code = code.toUpperCase();
        pattern = morseCode[code].split('').join(' ').split('').map(function(i) {
          switch (i) {
            case '.':
              return 100;
            case '-':
              return 300;
            case ' ':
              return 300;
          }
        });
        // console.log({pattern})
        info(code + ": " + morseCode[code]);
        navigator.vibrate(pattern);
        return setTimeout(function() {
          return resolve();
        }, pattern.reduce(function(a, b) {
          return a + b;
        }));
      });
    };
  
    start = function(str) {
      
      info("play \"" + str + "\"");
      return playMorseStr(str).then(function() {
        return sleep(1000);
      }).then(function() {
        return start();
      })["catch"](function(err) {
        info(err);
        return sleep(3000).then(function() {
          return start();
        }); 
      });
    };
  
      console.log("start");
      if (typeof (typeof navigator !== "undefined" && navigator !== null ? navigator.vibrate : void 0) !== 'function') {
        console.log("noavigator.vibrate not found");
      }
      console.log("navigator.vibrate found");






  return (
    <div className="px-5 cursor-pointer">
      <div className={`doesnotSup pointer-events-none w-screen h-screen absolute top-0 left-0 bg-black opacity-50 grid place-content-center ${browserSupportsSpeechRecognition?"hidden":"grid"}`}><h1 className='text-white text-5xl text-center font-bold'>Browser <br /> Does not support <br />STP</h1></div>
    <main  className={styles.main}> 
        <div className="absolute top-3 md:top-10 md:left-10 left-3 cursor-pointer text-lg md:text-xl hover:bg-neutral-200 p-5 rounded-lg transition-colors"><span className='icon-eye'></span></div>
        <h1 className={styles.title}>
        <p className='text-xl'>Research for Impact <br /><span className='text-sm'>(R4I)</span></p> 
        Vibrotactile morse code Application
        </h1>
        <p className='text-center my-5'>
          R4I prototype application to demonstrate <br /> vibrotactile communication 
        </p>
         
        <p className={styles.description}> 
          <span className='md:inline inline-block my-2 md:m-0 '>
            <code className={styles.code}><span className='icon-screen-smartphone'></span></code>
            <span className='block md:inline-block mt-4 md:mt-0'>
            Tap anywhere on the  
            </span>
          </span>
          <span className='md:inline  my-2 md:m-0 flex flex-col-reverse items-center'>
          <code className={styles.code}><span className="icon-microphone"></span></code>
          <span className=''>
          screen to enable Microphone
          </span>
          </span>
        </p>  

        <div className={styles.grid}>
          {}
          <div onClick={listening?SpeechRecognition.stopListening:SpeechRecognition.startListening}  className={`m-1 p-14 text-center border-neutral-300 text-neutral-300 border border-2 rounded-full transition-colors hover:bg-neutral-100 hover:text-neutral-600 cursor-pointer ${listening?" bg-blue-500 hover:bg-blue-500":""}`}>
           <span  className={`  icon-microphone text-7xl ${listening?"text-white":""}`}></span>
           
          </div>

        </div>
        <div className="response absolute bottom-0 text-center">
        <p>Microphone: {listening ? 'on' : 'off'}</p>
        <p>{transcript}</p>
      </div>
      </main>
      
      
      </div>
  );
}

export default App;
