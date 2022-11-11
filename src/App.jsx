import logo from './logo.svg';
import './App.css';
import styles from './styles/Home.module.css'
import { Promise } from 'bluebird';
import { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import logoBlack from './images/blackLogo.png'
import wheel from './images/wheel.svg'
import walking from './images/walking.svg'
import walking2 from './images/walking2.svg'

function App() {

  const [stillListening, setStillListening] = useState(false);
  const [tries, setTries] = useState(0);
  const [thecode, setCode] =useState('')
  const [themorseCode, setMorseCode] =useState('')
  useEffect(()=>{
    
    navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
     
    if (navigator.vibrate) {
	    // vibration API supported
      console.log("suported")
    navigator.vibrate(1000); 
    }
  },[]) 
  // const transcript = "hello"
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();
  
  useEffect(()=>{
    if(transcript!==""&&!listening){
      start(transcript)
    }
  },[transcript,listening])
  



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
    console.log(morseCode["A"].split('').join(' ').split(''))
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
        setCode(code);
        setMorseCode(morseCode[code])
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
        return start(str);
      })["catch"](function(err) {
        info(err);
        return sleep(3000).then(function() {
          return start(str);
        }); 
      });
    };
  
      console.log("start");
      if (typeof (typeof navigator !== "undefined" && navigator !== null ? navigator.vibrate : void 0) !== 'function') {
        console.log("noavigator.vibrate not found");
      }
      console.log("navigator.vibrate found");

console.log({transcript})

const ListenAlert=(props)=>{
  return(
    <p className={`p-2 text-white text-xs md:p-5 md:text-base  ${props.listening?"bg-green-500":"bg-red-500"}`}>Microphone: {props.listening?"ON":"OFF"}</p>
  )
}

const TextModal=(props)=>{
  return(
    <div onClick={()=>{
      SpeechRecognition.stopListening()
      setStillListening(false)
    }} className={`textModal mt-10 max-w-screen w-screen h-[500px] absolute top-0 left-0   transition-opacity ${props.stillListening?"opacity-1 pointer-events-auto delay-500":"opacity-0 pointer-events-none delay-0"}`}>
       <div className="textcontent  rounded-xl border-neutral-500 border-2 z-10 bg-white w-auto h-full box-border text-2xl md:text-5xl m-10 text-center p-10">
        <div className="text ">
          <p className='text-lg'>
            { 
            props.listening ?
              "Listening...":""
            }    
            { 
            !props.listening && props.transcript===""?
            <span>...Didn't quite catch that <br/> Please try again</span>:""
            }   
          </p>
          <p className=' bg-neutral-300 w-fit p-3 pb-5 rounded-sm'>
          {props.transcript}
          </p>
          {thecode}
        <br />
        {themorseCode}
            {/* {!listening && transcript!==''?start(props.transcript):null} */}
          </div>
          </div> 
          </div>
  )
}


  return (
    <div className="px-5 cursor-pointer">
      <div className="logo w-full absolute  h-fit text-center grid place-items-center">
      
      </div>
      <img src={walking} alt="" className="absolute md:h-[200px]  h-[150px] bottom-0 grayscale " />
      <img src={walking2} alt="" className="absolute md:h-[200px] h-[150px]  bottom-0 grayscale  right-0" />
      <div className={`doesnotSup pointer-events-none w-screen h-screen absolute top-0 left-0 bg-black opacity-50 grid place-content-center ${browserSupportsSpeechRecognition?"hidden":"grid"}`}><h1 className='text-white text-5xl text-center font-bold'>Browser <br /> Does not support <br />STP</h1></div>
      <div onClick={()=>{
        SpeechRecognition.stopListening()
        setStillListening(false)
      }} className={`hidder w-screen h-screen bg-black  absolute top-0 left-0 transition-opacity ${stillListening?"opacity-40 pointer-events-auto":"opacity-0 pointer-events-none"}`}></div>
      <TextModal className="z-10" listening={listening} transcript={transcript} stillListening={stillListening} />
    <main  className={styles.main}> 
        <div className="flex justify-between items-center w-screen absolute top-0 cursor-pointer text-lg md:text-xl hover:bg-neutral-200 p-5 transition-colors"><span className='icon-eye'></span><img src={logoBlack} className="hidden md:block my-1 w-[70px] " alt="Innov8Logo" /></div> 
        <h1 className={styles.title}>
        <p className='text-xl flex flex-col gap-2 items-center'><img src={logoBlack} className="md:hidden my-1 w-[70px] " alt="Innov8Logo" />Research for Impact <br /><span className='text-sm'>(R4I) </span>
</p> 
        Vibrotactile morse code Application
        </h1>
        <p className='text-center my-1 text-sm md:text-base md:my-5'>
          R4I prototype application to demonstrate <br /> vibrotactile communication 
        </p>
         
        <p className={styles.description}> 
          <span className='md:inline inline-block my-2 md:m-0 '>
            <span className='block md:inline-block mt-4 md:mt-0'>
            Tap anywhere on the  
            </span>
          </span>
          <span className='md:inline md:my-2 md:m-0 flex flex-col items-center'>
          <code className={styles.code}><span className='icon-screen-smartphone'></span></code>
          <span className=''>
          screen to enable Microphone
          </span>
          <code className={styles.code}><span className="icon-microphone"></span></code>
          </span>
        </p>  

        <div className={styles.grid}>
          {}
          <div onClick={()=>{
            if(listening){
              SpeechRecognition.stopListening()
            }else{
              setTries(1)
              setStillListening(true);
              SpeechRecognition.startListening()
            }}}  
            className={`
            m-1 p-14 text-center border-neutral-300 text-neutral-300 border-2 bg-white
            rounded-full transition-all duration-1000 hover:bg-neutral-100
             hover:text-neutral-600 cursor-pointer translate-y z-10  
             ${listening?" bg-green-500 hover:bg-green-500 border-black -translate-y-10":"translate-y-0"
             }`}>
           <span  className={`  icon-microphone text-7xl ${listening?"text-white":""}`}></span>
           
          </div>

        </div>
        <div className="response absolute bottom-0 text-center">
        <ListenAlert listening={listening}/>
        <p>{transcript}</p>
       
      </div>
      </main>
      
      
      </div>
  );
}

export default App;
