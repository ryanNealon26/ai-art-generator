import React, {useState} from "react";
import "./inputBox.css"
import Button from 'react-bootstrap/Button';
import LoadingWheel from "./loadingWheel";
import { io } from "socket.io-client";
const socket = io.connect("http://localhost:5000")
function InputBox(){
    const [placeHolderUrl, dalleUrl] = useState("");
    const[nullPrompt, prompt] = useState("");
    const [dalleStart, dalleLoading] = useState(false);
    const [gptStart, gptLoading] = useState(false);
    const generateArt = async () => {
      const inputPrompt = document.getElementById('inputBox').value;
      dalleLoading(true)
      socket.emit("createArt", inputPrompt);
      socket.on("imageData", (data) => {
        if (data == "no url"){
          window.alert("Invalid description or enter a prompt")
          dalleLoading(false);
        }else{
          dalleUrl(data);
          prompt(inputPrompt)
          dalleLoading(false);
        }
      })
    };
    const askChatGpt = () => {
      gptLoading(true);
      socket.emit("chatGPT")
      socket.on("gptResponse", (data) => {
        document.getElementById('inputBox').value = data;
        gptLoading(false)
      })
    }
    const regenerate = async () => {
      var prompt = nullPrompt;
      socket.emit("regenerateImage", prompt)
      dalleLoading(true)
      socket.on("sendRegeneratedUrl", (data) =>{
        dalleUrl(data);
        dalleLoading(false);
      })
    }
    const downloadImage = () => {
     var imagePdf = document.createElement('a');
     imagePdf.href = placeHolderUrl;
     imagePdf.download = 'image.pdf';
     imagePdf.dispatchEvent(new MouseEvent('click'));
    };
    const refreshPage = () => {
      window.location.reload(false);
    }
  return(
    <div className="holder">
      {!nullPrompt && <h3 className='h2Text'>Enter a description and see your vision come to life!</h3>}
      {nullPrompt && <h3 className='h2Text'>{nullPrompt}</h3>}
      {placeHolderUrl && <div className='imageContainer'>
        <img className='aiImage' alt="AI Generated Image" src={placeHolderUrl}></img>
      </div>}
      <div className="aiGeneratorHolder">
        {!placeHolderUrl && <div className="inputContainer">
          <textarea type='text' className='inputBox' placeholder="Enter prompt" id='inputBox' maxLength='250'></textarea>
        </div>}
        <div className="buttonContainer">
          {!placeHolderUrl && <Button className= 'btn' onClick={generateArt} variant="dark">Create Image
          {dalleStart && <LoadingWheel></LoadingWheel>}
          </Button>}
          {!placeHolderUrl && <Button className= 'btn' onClick={askChatGpt} variant="dark">Ask ChatGPT 
          {gptStart && <LoadingWheel></LoadingWheel>}
          </Button>}
          {placeHolderUrl && <Button  className='btn' onClick={downloadImage} variant="dark">Inspect</Button>}
          {placeHolderUrl && <Button  className='btn' onClick={refreshPage} variant="dark">Reset</Button>}
          {placeHolderUrl && <Button className= 'btn' onClick={regenerate} variant="dark">Regenerate
          {dalleStart && <LoadingWheel></LoadingWheel>}
          </Button>}
        </div>
      </div>
    </div>
  )
}
export default InputBox;