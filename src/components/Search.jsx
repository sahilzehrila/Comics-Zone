import "../style/Search.scss"
import { useState } from "react"
import md5 from 'md5'
import Chatacters from "./Chatacters"
import Comics from './Comics'



export default function Search() {


const [characterName ,  setCharacterName] =  useState("")
const [characterData , setCharacterData] = useState(null)
const [comicData , setComicData] = useState(null)


const publickey = import.meta.env.VITE_PUBLIC_KEY
const privatekey = import.meta.env.VITE_PRIVAET_KEY



const handelSubmit = (e)=>{
    e.preventDefault();
    getCharacterData();
    
}
const getCharacterData=()=>{
setCharacterData(null);
setComicData(null);
const timeStamp = new Date().getTime();
const hash = generateHash(timeStamp);


const url = `https://gateway.marvel.com:443/v1/public/characters?apikey=${publickey}&hash=${hash}&ts=${timeStamp}&nameStartsWith=${characterName}&limit=100`

fetch(url).then(response => response.json()).then((result)=>{
    setCharacterData(result.data)
  
}).catch(e => console.log( "there is an error : " ,  e));

}

const generateHash = (timeStamp)=>{
    return md5(timeStamp  + privatekey + publickey  )
}

const hadleChange =(e)=>{

    setCharacterName(e.target.value);
    
}
const handleReset =()=>{
  setCharacterData(null)
  setComicData(null)
  setCharacterName("")
}

const getComicData = (CharacterId)=>{
  window.scrollTo({ top: 0, left: 0 });

    const timeStamp = new Date().getTime();
    const hash = generateHash(timeStamp);

    const url = `https://gateway.marvel.com:443/v1/public/characters/${CharacterId}/comics?apikey=${publickey}&hash=${hash}&ts=${timeStamp}`;

    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        setComicData(result.data);
        console.log(result.data);
      })
      .catch(() => {
        console.log("error while getting comic data");
      });
 
}

  return (

     <>
  

    <form className="search" onSubmit={handelSubmit}> 
        <input type="text" placeholder="Enter Character Name" onChange={hadleChange} />
        <div className="buttons">

            <button type="submit"> Gete Character Data </button>
            <button type="reset" onClick={handleReset}> Reset </button>


        </div>
      
      </form>

      {!comicData && characterData && characterData.results[0] && (
        <Chatacters data={characterData.results} onClick={getComicData} />
      )}




     {comicData && comicData.results[0] && (
        <Comics data={comicData.results} onClick={() => {}} />
      )}


    </>

  );
}
