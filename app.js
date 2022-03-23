const express = require('express')
const cors = require('cors')
const axios = require('axios')
const whitelist = require('./whitelist.json')
const app = express()
const port = process.env.PORT || 80
const apikey = process.env.MUSIXMATCH_API_KEY

const restriction = (req, res, next) => {
  const origin = req.get('origin')
  const ip = req.ip
  console.log('Incoming request origin:', origin)
  console.log('Incoming request ip:', ip)
  if (whitelist.includes(origin) || whitelist.includes(ip)) {
    next()
  } else {
    res.send('No access')
  }
}

app.enable('trust proxy')

app.use(cors())

app.use(restriction)

app.get('/chart.tracks.get', async (req, res) => {
  const apiResponse = await axios.get(`https://api.musixmatch.com/ws/1.1/chart.tracks.get?chart_name=hot&page=1&page_size=50&country=US&f_has_lyrics=1&apikey=${apikey}`);
  res.json(apiResponse.data.message.body)
})

app.get('/matcher.lyrics.get', async (req, res) => {
  const apiResponse = await axios.get(`https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?q_track=${req.query.q_track}&q_artist=${req.query.q_artist}&apikey=${apikey}`);
  res.json(apiResponse.data.message.body)
})

app.get('/track.lyrics.get', async (req, res) => {
  const apiResponse = await axios.get(`https://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${req.query.track_id}&apikey=${apikey}`);
  res.json(apiResponse.data.message.body)
})

app.listen(port, () => {
  console.log('API key:', apikey)
  console.log(`App listening on port ${port}`)
})
