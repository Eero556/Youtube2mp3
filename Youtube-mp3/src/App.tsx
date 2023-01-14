import { useState } from 'react'
import './App.css'
import axios from "axios"
import {youtube_parser} from "./Utils/parser"
function App() {

  interface MyObject {
    title: string,
    link: string,
    status: string,
    progress: number,
    msg: string
  }
  const [youtubeurl, setYoutubeURL] = useState<string>("")
  const [mp3data,setMp3Data] = useState<MyObject>();
  

  const handleSubmit = async () =>{
    
    try{
      if(youtubeurl === ""){
        return
      }
  
      const youtubeID = youtube_parser(youtubeurl)
      
      const responce = await axios.get<MyObject>("https://youtube-mp3-converter.p.rapidapi.com/dl",{headers:{
        'X-RapidAPI-Key': import.meta.env.VITE_REACT_APP_API_KEY,
        'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
      }, params: {
          id:youtubeID
      }})
      
      console.log(responce.data)
      

      if(responce.data.status === "fail"){
        alert("Invalid youtube link")
        setMp3Data(undefined)
      }
      
      if(responce.data.msg === "in process" || responce.data.msg === "in queue"){
        setTimeout(handleSubmit,8000)
        console.log("Prosessing")
        setMp3Data(responce.data)
      }


      if(responce.data.status === "ok"){
        setMp3Data(responce.data)
        setYoutubeURL("")
      }
      
    }catch(e){
      console.log(e)
      setMp3Data(undefined)
      
    }

    
  }
  


  return (
    <div className="App">
      <h1>Youtube2mp3</h1>

      <form onSubmit={(e:any) =>{
        e.preventDefault()
        handleSubmit()
      }}>
        <input value={youtubeurl} onChange={(e:any) =>{setYoutubeURL(e.target.value)}} type="text" placeholder='Paste Youtube video URL'/>
        <button className='submitbutton' type='submit'>Download</button>
      </form>
      <h2 className={mp3data?.status === "ok" ? "hidden" : "visible"}>{!mp3data ? "" :`MP3 Link will be displayed when done loading... ${mp3data?.progress}%`}</h2>
      <a className={mp3data?.msg === "Invalid Video Id" || mp3data?.msg === "in process" ? "hidden" : "visible"} href={mp3data?.link} target="_blank">{mp3data?.msg === "Invalid Video Id" ? mp3data?.msg: mp3data?.title}</a>
    </div>
  )
}

export default App
