import { useState, useEffect } from 'react'
import { Container, Box, Alert, Grid, CircularProgress, useTheme, useMediaQuery } from '@mui/material'
import TippingHeader from '../components/TippingHeader'
import PredictionForm from '../components/PredictionForm'
import ExportSection from '../components/ExportSection'
import PredictionList from '../components/PredictionList'
import InfoIcon from '@mui/icons-material/Info'

const Tipping = () => {
  const [games, setGames] = useState([])
  const [predictions, setPredictions] = useState([])
  const [userName, setUserName] = useState('')
  const [selectedMatch, setSelectedMatch] = useState('')
  const [scoreA, setScoreA] = useState('')
  const [scoreB, setScoreB] = useState('')
  const [existingTips, setExistingTips] = useState([])
  const [loading, setLoading] = useState(true)
  const [copySuccess, setCopySuccess] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Meccsek lekérése
        const gamesResponse = await fetch('https://worldcup26.ir/get/games')
        const gamesData = await gamesResponse.json()
        setGames(gamesData.games)

        // Meglévő tippek lekérése
        const tipsResponse = await fetch('/tipps.json')
        const tipsData = await tipsResponse.json()
        setExistingTips(tipsData.predictions)

        setLoading(false)
      } catch (err) {
        console.error('Hiba az adatok lekérésekor:', err)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getGameInfo = (matchId) => {
    const game = games.find((g) => parseInt(g.id) === matchId)
    if (game) {
      return `${game.home_team_name_en} vs ${game.away_team_name_en} (${game.local_date})`
    }
    return `Meccs #${matchId}`
  }

  const selectedGameInfo = selectedMatch ? getGameInfo(parseInt(selectedMatch)) : ''

  const handleAddPrediction = () => {
    if (!userName || !selectedMatch || scoreA === '' || scoreB === '') {
      alert('Kérlek, töltsd ki az összes mezőt!')
      return
    }

    const newPrediction = {
      user: userName,
      matchId: parseInt(selectedMatch),
      scoreA: parseInt(scoreA),
      scoreB: parseInt(scoreB),
    }

    setPredictions([...predictions, newPrediction])
    setSelectedMatch('')
    setScoreA('')
    setScoreB('')
  }

  const handleRemovePrediction = (index) => {
    const newPredictions = predictions.filter((_, i) => i !== index)
    setPredictions(newPredictions)
  }

  const getAvailableGames = () => {
    return games.filter((game) => {
      const hasPrediction = predictions.some((p) => parseInt(p.matchId) === parseInt(game.id))
      const hasExistingTip = existingTips.some((t) => parseInt(t.matchId) === parseInt(game.id))
      return !hasPrediction && !hasExistingTip
    })
  }

  const getGameDetails = (matchId) => {
    return games.find((g) => parseInt(g.id) === matchId)
  }

  const handleDownload = () => {
    const json = JSON.stringify({ predictions }, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tipps_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCopyToClipboard = () => {
    const json = JSON.stringify({ predictions }, null, 2)
    navigator.clipboard.writeText(json).then(() => {
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    })
  }

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress sx={{ color: '#2E8B57' }} />
      </Container>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#f5f5f5', py: { xs: 2, sm: 4 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2 } }}>
        <TippingHeader isMobile={isMobile} />

        {copySuccess && (
          <Alert severity="success" sx={{ mb: 2, mx: 'auto' }}>
            ✅ Másolva a vágólapra!
          </Alert>
        )}

            <PredictionForm
              games={getAvailableGames()}
              userName={userName}
              setUserName={setUserName}
              selectedMatch={selectedMatch}
              setSelectedMatch={setSelectedMatch}
              scoreA={scoreA}
              setScoreA={setScoreA}
              scoreB={scoreB}
              setScoreB={setScoreB}
              selectedGameInfo={selectedGameInfo}
              onAddPrediction={handleAddPrediction}
            />

          {/* Letöltés / Másolás */}
            <ExportSection
              onDownload={handleDownload}
              onCopyToClipboard={handleCopyToClipboard}
            />

        {/* Az adott tippek listája */}
        <PredictionList
          predictions={predictions}
          onRemovePrediction={handleRemovePrediction}
          isMobile={isMobile}
          getGameDetails={getGameDetails}
        />
      </Container>
    </Box>
  )
}

export default Tipping
