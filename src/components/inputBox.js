import React, {useState} from "react";
import "./inputBox.css"
import Button from 'react-bootstrap/Button';
import LoadingWheel from "./loadingWheel";
import { io } from "socket.io-client";
const { Configuration, OpenAIApi } = require("openai");
const config = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(config);
const socket = io.connect("http://localhost:5000")
function InputBox(){
    const [placeHolderUrl, dalleUrl] = useState("");
    const[nullPrompt, prompt] = useState("");
    const [dalleStart, dalleLoading] = useState(false);
    const [gptStart, gptLoading] = useState(false);
    const [galleryHide, galleryShow] = useState(false);
    const generateArt = async () => {
      const inputPrompt = document.getElementById('inputBox').value;
      dalleLoading(true)
      try{
        const response = await openai.createImage({
          prompt: inputPrompt,
          n: 1,
          size: "1024x1024",
        });
        var image_url = response.data.data[0].url;
        dalleUrl(image_url);
        prompt(inputPrompt)
        dalleLoading(false)
        socket.emit("imageData", [image_url, inputPrompt])
      }catch(err){
        dalleLoading(false)
        window.alert('Unsucceful description or fill in a prompt')
      }
    };
    const askChatGpt = () => {
      gptLoading(true);
      openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{role: 'user', content: "Create me a random description to create art, the description must be less than 240 characters including spacing"}]
      }).then(res =>{
        document.getElementById('inputBox').value = res.data.choices[0].message.content;
        gptLoading(false)
      })
    }
    const regenerate = async () => {
      dalleLoading(true)
      const response = await openai.createImage({
        prompt: nullPrompt,
        n: 1,
        size: "1024x1024",
      });
      var regenerated_url = response.data.data[0].url;
      dalleUrl(regenerated_url);
      dalleLoading(false);
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