import { useState, useEffect } from 'react'
import { Container, Box, Alert, CircularProgress, useTheme, useMediaQuery, Button } from '@mui/material'
import ReplayIcon from '@mui/icons-material/Replay'
import TippingHeader from '../components/TippingHeader'
import PredictionForm from '../components/PredictionForm'
import ExportSection from '../components/ExportSection'
import PredictionList from '../components/PredictionList'

const Tipping = () => {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [copySuccess, setCopySuccess] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [predictions, setPredictions] = useState(() => {
    const savedPredictions = localStorage.getItem('tipping_predictions')
    return savedPredictions ? JSON.parse(savedPredictions) : []
  })

  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('tipping_userName') || ''
  })

  const [selectedMatch, setSelectedMatch] = useState('')
  const [scoreA, setScoreA] = useState('')
  const [scoreB, setScoreB] = useState('')
  const [advancer, setAdvancer] = useState('')
  
  const [errors, setErrors] = useState({})

  useEffect(() => {
    localStorage.setItem('tipping_predictions', JSON.stringify(predictions))
  }, [predictions])

  useEffect(() => {
    localStorage.setItem('tipping_userName', userName)
  }, [userName])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gamesResponse = await fetch('https://worldcup26.ir/get/games')
        const gamesData = await gamesResponse.json()
        setGames(gamesData.games || gamesData)
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
      const homeName = game.home_team_name_en || game.home_team_label || 'Ismeretlen'
      const awayName = game.away_team_name_en || game.away_team_label || 'Ismeretlen'
      return `#${game.id} - ${homeName} vs ${awayName} (${game.local_date})`
    }
    return `Meccs #${matchId}`
  }

  const selectedGameInfo = selectedMatch ? getGameInfo(parseInt(selectedMatch)) : ''

  const handleAddPrediction = () => {
    const isKnockout = parseInt(selectedMatch) > 72
    const newErrors = {}

    if (!userName.trim()) newErrors.userName = true
    if (!selectedMatch) newErrors.match = true
    if (scoreA === '') newErrors.scoreA = true
    if (scoreB === '') newErrors.scoreB = true
    if (isKnockout && !advancer) newErrors.advancer = true

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const newPrediction = {
      user: userName,
      matchId: parseInt(selectedMatch),
      scoreA: parseInt(scoreA),
      scoreB: parseInt(scoreB),
      advancer: isKnockout ? advancer : null,
      isExported: false
    }

    const filteredPredictions = predictions.filter(p => p.matchId !== newPrediction.matchId)
    setPredictions([...filteredPredictions, newPrediction])
    
    setSelectedMatch('')
    setScoreA('')
    setScoreB('')
    setAdvancer('')
    setErrors({})
  }

  const handleRemovePrediction = (matchIdToRemove) => {
    const newPredictions = predictions.filter((p) => p.matchId !== matchIdToRemove)
    setPredictions(newPredictions)
  }

  const handleResetExportStatus = () => {
    const resetPredictions = predictions.map(p => ({ ...p, isExported: false }))
    setPredictions(resetPredictions)
  }

  const getAvailableGames = () => {
    return games.filter((game) => {
      return !predictions.some((p) => parseInt(p.matchId) === parseInt(game.id))
    })
  }

  const getGameDetails = (matchId) => {
    return games.find((g) => parseInt(g.id) === matchId)
  }

  const getUnexportedPredictions = () => predictions.filter(p => !p.isExported)

  const markAsExported = () => {
    const updated = predictions.map(p => ({ ...p, isExported: true }))
    setPredictions(updated)
  }

  const handleDownload = () => {
    const newTips = getUnexportedPredictions()
    if (newTips.length === 0) return

    const cleanTips = newTips.map(({ isExported, ...rest }) => rest).sort((a, b) => a.matchId - b.matchId)
    const json = JSON.stringify({ predictions: cleanTips }, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tipps_uj_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    markAsExported()
  }

  const handleCopyToClipboard = () => {
    const newTips = getUnexportedPredictions()
    if (newTips.length === 0) return

    const cleanTips = newTips.map(({ isExported, ...rest }) => rest).sort((a, b) => a.matchId - b.matchId)
    const json = JSON.stringify({ predictions: cleanTips }, null, 2)
    navigator.clipboard.writeText(json).then(() => {
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
      markAsExported()
    })
  }

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress sx={{ color: '#2E8B57' }} />
      </Container>
    )
  }

  const unexportedCount = getUnexportedPredictions().length
  const exportedCount = predictions.length - unexportedCount

  return (
    <Box sx={{ minHeight: '100vh', background: '#f5f5f5', py: { xs: 2, sm: 4 }, mb: 4 }}>
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
          advancer={advancer}
          setAdvancer={setAdvancer}
          selectedGameInfo={selectedGameInfo}
          onAddPrediction={handleAddPrediction}
          getGameDetails={getGameDetails}
          errors={errors}
          setErrors={setErrors}
        />

        <ExportSection
          onDownload={handleDownload}
          onCopyToClipboard={handleCopyToClipboard}
          unexportedCount={unexportedCount}
        />

        <PredictionList
          predictions={predictions}
          onRemovePrediction={handleRemovePrediction}
          isMobile={isMobile}
          getGameDetails={getGameDetails}
        />

        {/* Gomb az oldal legalján a tévesztések elkerülése végett */}
        {exportedCount > 0 && (
          <Box sx={{ mt: 2, mb: 4, display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
            <Button
              variant="text"
              startIcon={<ReplayIcon />}
              onClick={handleResetExportStatus}
              sx={{
                color: '#888',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
                '&:hover': { background: '#f5f5f5', color: '#d32f2f' }
              }}
            >
              Újra szeretném exportálni a tippeket (összesen {exportedCount} tipp)
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default Tipping