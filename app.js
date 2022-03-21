const express = require('express')
const cors = require('cors')
const axios = require('axios')
const hostWhitelist = require('./whitelist.json')
const app = express()
const port = process.env.PORT || 80
const apikey = process.env.MUSIXMATCH_API_KEY

const restrictHost = (req, res, next) => {
  console.log('Headers:', req.headers)
  const host = req.get('host')
  console.log('Incoming request from host:', host)
  if (hostWhitelist.includes(host)) {
    next()
  } else {
    res.send('No access')
  }
}

app.use(cors())

app.use(restrictHost)

app.get('/chart.tracks.get', async (req, res) => {
  const apiResponse = await axios.get(`https://api.musixmatch.com/ws/1.1/chart.tracks.get?chart_name=hot&page=1&page_size=50&country=US&f_has_lyrics=1&apikey=${apikey}`);
  res.json(apiResponse.data.message.body)
})

app.get('/matcher.lyrics.get', async (req, res) => {
  const apiResponse = await axios.get(`https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?q_track=${req.query.q_track}&q_artist=${req.query.q_artist}&apikey=${apikey}`);
  res.json(apiResponse.data.message.body)
})

app.listen(port, () => {
  console.log('API key:', apikey)
  console.log(`App listening on port ${port}`)
})
