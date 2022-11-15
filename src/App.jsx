import logo from './logo.svg';
import './App.css';
import styles from './styles/Home.module.css'
import { Promise } from 'bluebird';
import { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import logoBlack from './images/blackLogo.png'
import innov8 from './images/innov8Logo.png'
import tetfund from './images/tetfundLogo.png'
import walking from './images/walking.svg'
import walking2 from './images/walking2.svg'

var morseCode = {
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
  Z: "--..",
  ".":"",
  ",":"",
  ' ':""
};

function App() {
  
  const [stillListening, setStillListening] = useState(false);
  const [tries, setTries] = useState(0);
  const [thecode, setCode] =useState('')
  const [morseC, setMorseC] =useState('')
  const [pattern,setPattern] = useState([])
  const [transArray, setTransArray] =useState([])
  useEffect(()=>{
    
    navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
     
    if (navigator.vibrate) {
	    // vibration API supported
      console.log("suported")
    navigator.vibrate(1000); 
    }
  },[]) 
  // const transcript = "hellothere"
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();
  
  useEffect(()=>{
    if(transcript!==""&&!listening){
      // start(transcript)
      setTransArray(transcript.split(''))
      
      // console.log({transArray})
    }

  },[transcript,listening]) 

  // useEffect(()=>{
  //   transArray.forEach((item, i) => setTimeout(
  //     () => setCode(item),
  //     5000, // 5000, 10000, 15000
  //   ));

  // },[transArray])


// console.log({transArray})
const [mediaItem, setMediaItem] = useState(transArray[0]);
const [index, setIndex] = useState(0);

useEffect(() => {
  console.log({transArray})
  const timerId = setInterval(
    () => {
      setIndex((i) => (i + 1) % transArray.length)
      
      
    },
    5000
  );
  return () => clearInterval(timerId);
}, [transArray]);

let doIt=(x)=>{
  let p =[];
  console.log({x})
  if(x === undefined){return 0}else{
  let y = morseCode[x.toUpperCase()].split('').join(' ').split('')
  y.map((i)=> {
    switch (i) {
      case '.':
        p.push(100);
        break

      case '-':
        p.push(300);
        break

      case ' ':
        p.push(300);
        break
      default:
        p.push(0)
        break

    }
  });
}
setPattern(p)
  return p
}
useEffect(() => {
  if(transArray.length>1){
  setMediaItem(transArray[index]);
  doIt(transArray[index])
  // console.log(transArray[index])
  }
}, [index,transArray]);


useEffect(()=>{
  console.log(mediaItem)
  if(mediaItem!== undefined){
  
  }
},[])

let reset=()=>{
  setTransArray([]);
  setPattern([]);
  SpeechRecognition.resetTranscript()
}

  var info, playMorseCode, playMorseStr, sleep, start;
  
    info = function(msg) {
      console.log(msg);
    };
  
   
    // console.log(morseCode["A"].split('').join(' ').split(''))
    sleep = function(msec) {
        return setTimeout(function() {
        }, msec); 
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
        return start(str);
      })["catch"](function(err) {
        info(err);
        return sleep(3000).then(function() {
          return start(str);
        }); 
      });
    };
  
//       console.log("start");
//       if (typeof (typeof navigator !== "undefined" && navigator !== null ? navigator.vibrate : void 0) !== 'function') {
//         console.log("noavigator.vibrate not found");
//       }
//       console.log("navigator.vibrate found");

// console.log({transcript})
const ListenAlert=(props)=>{
  return(
    <p className={`p-2 text-white text-xs md:p-5 md:text-base z-20 ${props.listening?"bg-green-500":"bg-red-500"}`}>Microphone: {props.listening?"ON":"OFF"}</p>
  )
}

const TextModal=(props)=>{
  return(
    <div onClick={()=>{
      SpeechRecognition.stopListening()
      setStillListening(false)
    }} className={`textModal z-10 mt-10 max-w-screen w-screen h-[500px] absolute top-0 left-0   transition-opacity ${props.stillListening?"opacity-1 pointer-events-auto delay-500":"opacity-0 pointer-events-none delay-0"}`}>
       <div className="textcontent  rounded-[2.5rem] border-neutral-500 border-2 z-10 bg-white w-auto h-full box-border text-2xl md:text-5xl m-5 md:m-12 text-center p-10">
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
          <p>
         {mediaItem?.toUpperCase()}
         </p>
         <p>
         {morseCode[mediaItem?.toUpperCase()]}
         </p>
         <p className=' text-sm' >Pattern: {pattern.map((char)=>{if(char===100){return(<p className=' text-xs'>Low</p>)}else{return(<p className=' text-xs'>High</p>)}})}</p>
          
            {/* {!listening && transcript!==''?start(props.transcript):null} */}
          </div>
          </div> 
          </div>
  )
}


  return (
    <div className=" cursor-pointer bg-white overflow-hidden flex flex-col max-h-screen h-screen relative">
      
      
      <div className={`doesnotSup pointer-events-none w-screen h-screen absolute top-0 left-0 bg-black opacity-50 grid place-content-center ${browserSupportsSpeechRecognition?"hidden":"grid"}`}>
        <h1 className='text-white text-5xl text-center font-bold'>Browser <br /> Does not support <br />STP</h1>
      </div>
      <div onClick={()=>{
        SpeechRecognition.stopListening()
        setStillListening(false)
      }} className={`hidder w-screen h-screen bg-black z-10  absolute top-0 left-0 transition-opacity ${stillListening?"opacity-40 pointer-events-auto":"opacity-0 pointer-events-none"}`}></div>
      <TextModal className="z-10" listening={listening} transcript={transcript} stillListening={stillListening} />
      <main  className={styles.main}> 
        <img src={walking} alt="" className="absolute md:h-[200px]  h-[100px] bottom-0 left-0 grayscale " />
        <img src={walking2} alt="" className="absolute md:h-[200px] h-[100px]  bottom-0 grayscale  right-0" />
        <div className="flex justify-between items-center w-screen absolute top-0 cursor-pointer text-lg md:text-xl hover:bg-neutral-200 p-1 md:p-5 transition-colors">
          
          <span className='icon-eye flex-1'></span>
          
          <ListenAlert listening={listening}/>
          
          <div className="imgcont flex-1 flex justify-end">
            <img src={logoBlack} className=" my-1 w-[50px] md:w-[100px] " alt="Innov8Logo" />
          </div>
          
        
        </div> 
        <h1 className={styles.title}>
        <p className='text-sm flex flex-col gap-2 items-center font-normal'>Research for Impact <br /><span className='text-sm'>(R4I) </span>
        </p> 
          Vibrotactile Telemetry using Morse Code
        </h1>
        <p className='text-center my-1 text-sm md:text-base md:my-5 hidden md:block'>
          R4I prototype application to demonstrate <br /> vibrotactile communication 
        </p>
         
        <p className={styles.description}> 
          <span className='md:inline inline-block '>
            <span className='block md:inline-block'>
            Tap anywhere on the  
            </span>
          </span>
          <span className='md:inline md:my-2 md:m-0 flex flex-col items-center'>
          <code className={styles.code}><span className='icon-screen-smartphone'></span></code>
          <span className=''>
          screen to enable Microphone
          </span>
          <code className={styles.code}><span className="icon-microphone" ></span></code>
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
            m-[] p-14 text-center  text-ground border-[.5rem] 
            rounded-full transition-all duration-500 
              cursor-pointer translate-y z-10  
             ${listening?" bg-mygreen border-black -translate-y-10":"hover:text-ground hover:bg-neutral-100 translate-y-0 bg-white border-ground"
             }`}>
           <span  className={`  icon-microphone text-7xl ${listening?"text-white":""}`}></span>
           
          </div>

        </div>
        <div className="response absolute bottom-0 text-center">
        
        <p>{transcript}</p>
       
      </div>
      </main>
      <footer id="footer" className='max-h-[5rem] h-[5rem] justify-between flex px-10'>
        
        <img className='w-20 self-center' src={innov8} alt="" />
        <img className='w-20 self-center' src={tetfund} alt="" />
      </footer>
      
      </div>
  );
}

export default App;
