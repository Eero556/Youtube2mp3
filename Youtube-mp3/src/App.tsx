import { useState } from 'react'
import './App.css'
import axios from "axios"
import {youtube_parser} from "./Utils/parser"
function App() {

  interface MyObject {
    title: string;
    link: string;
  }
  const [youtubeurl, setYoutubeURL] = useState<string>("")
  const [mp3data,setMp3Data] = useState<MyObject>();



  const handleSubmit = async (e:any) =>{
    e.preventDefault()
    
    try{
      if(youtubeurl === ""){
        return
      }
  
      const youtubeID = youtube_parser(youtubeurl)
      
      const responce = await axios.get<MyObject>("https://youtube-mp3-converter.p.rapidapi.com/dl",{headers:{
        'X-RapidAPI-Key': 'aceebc0ddcmshff70e7f7b1386a4p19b1f6jsn30c0cdb6a88b',
        'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
      }, params: {
          id:youtubeID
      }})
      console.log(responce.data)
      setMp3Data(responce.data)
    }catch(e){
      console.log(e)
    }
    setYoutubeURL("")
    
  }

  return (
    <div className="App">
      <h1>Youtube2mp3</h1>

      <form onSubmit={handleSubmit}>
        <input value={youtubeurl} onChange={(e:any) =>{setYoutubeURL(e.target.value)}} type="text" placeholder='Paste Youtube video URL'/>
        <button type='submit'>Submit</button>
      </form>
      <h3></h3>
      <a className={!mp3data || mp3data.link === "" ? "hidden" : "visible"} href={mp3data?.link} target="_blank">MP3 LINK</a>
      {mp3data?.link ? <a>heyy</a> : ""}
    </div>
  )
}

export default App
