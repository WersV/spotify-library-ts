import './style.css'
// import { library, icon } from '@fortawesome/fontawesome-svg-core'
// import { faCamera } from '@fortawesome/free-solid-svg-icons'

// library.add(faCamera)

// const camera = icon({ prefix: 'fas', iconName: 'camera' })

const CLIENT_ID: string = '965ec20b02724d0b81b50ad84d38cf24'
const CLIENT_SECRET: string = '23fc30b0befb4067b834154b3aa14bad'

const button: HTMLButtonElement = document.querySelector('.btn1')!
const artistInput: HTMLInputElement = document.querySelector('.artist-input')!

const debounce = (callback: (...args: any) => void, wait: number) => {
  let timeout: number;
  return (...args: any[]) => {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => callback.apply(context, args), wait);
  };
}

const getToken = async () => {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
  })
  const token = await response.json()
  localStorage.setItem('access_token', token.access_token)
}

const searchArtist = debounce(async (artist: string) => {
  const response = await fetch(`https://api.spotify.com/v1/search?q=${artist}&type=artist&limit=5`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    }
  })
  const data = await response.json()
  console.log(data.artists.items);
}, 1000)

// const getArtist = () => {
//   fetch('https://api.spotify.com/v1/artists/0TnOYISbd1XYRBk9myaseg', {
//     headers: {
//       'Authorization': `Bearer ${localStorage.getItem('access_token')}`
//     }
//   })
//   .then(data => data.json())
//   .then(resp => console.log(resp))
// }

button.addEventListener('click', () => {
  searchArtist(artistInput.value)
})

artistInput.addEventListener('input', () => {
  searchArtist(artistInput.value)
})

getToken()