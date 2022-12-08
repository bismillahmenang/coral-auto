# coral-auto

this is a github cron to save data from coralcube api, it is saved into database on deta.sh, and to serve the data you can use fetch web api like this:

```
export async function getNFTRoyaltyFromDeta(updateAuthority, symbol,mintAddress,last){
    const res = await fetch('https://clggjw.deta.dev/coral', {
        method: 'POST',
        body: JSON.stringify({
            updateAuthority, symbol:symbol.toLowerCase().replace(/\s/g, "_"),mintAddress,last
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return res.json()
}
```

if data is `[]` or nothing, it means that the collection data hasnt been saved to the database you need to use coral cube api again and wait for the data to be saved in the future
