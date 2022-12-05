import {Deta} from 'npm:deta@latest'
import axios from "npm:axios@latest"
import { config } from "https://deno.land/x/dotenv/mod.ts";
const deta = Deta(Deno.env.get("panda"))


// This how to connect to or create a database.
const collectionList = deta.Base('collection_list')
const royalty = deta.Base('royalty')

async function cobaCron() {
    let ress = await collectionList.fetch({})
    let allItems = ress.items


    // continue fetching until last is not seen
    while (ress.last) {
        ress = await collectionList.fetch({}, {last: ress.last})
        allItems = allItems.concat(ress.items)

    }
    allItems = allItems.filter(({updateAuthority, symbol}) => updateAuthority && symbol)
    if (allItems.length === 0) return
    for (let i = 0; i < allItems.length; i++) {
try{
 console.log(allItems[i].symbol)
        let data = await getData(allItems[i].updateAuthority, allItems[i].symbol)
          if(data.length>0){
            for (let j = 0; j < data.length; j++) {
            
                const {signature} = data[j];
                await royalty.put({...data[j], collectionName: allItems[i].symbol}, signature)
            }
        while (data.length > 0) {
            await timeout(1000)
            const date = data2[data2.length - 1].time
         

            data = await getData(allItems[i].updateAuthority, allItems[i].symbol, date)

            if (data.length === 0) {
                break

            }
            for (let j = 0; j < data.length; j++) {
            
                const {signature} = data[j];
                await royalty.put({...data[j], collectionName: allItems[i].symbol}, signature)
            }
        }    
        }else{
            break;
        }



           
}catch(e){
    console.log(e.message)
}


    }
    console.log("sukses")
    return ress.length
}

cobaCron()

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function setTimeToZero(timestamp) {
  // Parse the timestamp string using the Date object
  var date = new Date(timestamp)

  // Set the hours, minutes, and seconds to 0 using the setUTCHours, setUTCMinutes, and setUTCSeconds methods
  date.setUTCHours(0)
  date.setUTCMinutes(0)
  date.setUTCSeconds(0)

  // Convert the date back to a string in ISO format using the toISOString method
  return encodeURIComponent(date.toISOString()
    .replace(".000Z", ""))
}

async function getData(updateAuthority, symbol, before) {
  try {
    const {data} = await axios.get(`https://api.coralcube.cc/0dec5037-f67d-4da8-9eb6-97e2a09ffe9a/inspector/getMintActivities?update_authority=${updateAuthority}&collection_symbol=${symbol}${before ? "&before=" + setTimeToZero(before) : ""}`)
    //    console.log(data)
    return data
  } catch (e) {
    console.log(e.message)
    return []
  }
//    console.log(`https://api.coralcube.cc/0dec5037-f67d-4da8-9eb6-97e2a09ffe9a/inspector/getMintActivities?limit=10&update_authority=${updateAuthority}&collection_symbol=${symbol}${before ? "&before=" + before : ""}`)

}


//getData("yootn8Kf22CQczC732psp7qEqxwPGSDQCFZHkzoXp25", "y00ts",setTimeToZero("2022-11-12T17:00:00"))
