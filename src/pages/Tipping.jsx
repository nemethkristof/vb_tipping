import { useState, useEffect } from 'react'
import { Container, Box, Alert, CircularProgress, useTheme, useMediaQuery, Button } from '@mui/material'
import ReplayIcon from '@mui/icons-material/Replay'
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'
import emailjs from '@emailjs/browser'
import TippingHeader from '../components/TippingHeader'
import PredictionForm from '../components/PredictionForm'
import ExportSection from '../components/ExportSection'
import PredictionList from '../components/PredictionList'
import { useGames } from '../hooks/useGames'

const Tipping = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  // UI Állapotok
  const [feedbackMsg, setFeedbackMsg] = useState(null)
  const [isSendingEmail, setIsSendingEmail] = useState(false)

  const { data: games = [], isLoading: loading } = useGames()

  // Biztonságos LocalStorage inicializálás
  const [predictions, setPredictions] = useState(() => {
    try {
      const saved = window.localStorage.getItem('tipping_predictions')
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      console.warn('Hiba a localStorage olvasásakor:', e)
      return []
    }
  })

  const [userName, setUserName] = useState(() => {
    try {
      return window.localStorage.getItem('tipping_userName') || ''
    } catch (e) {
      return ''
    }
  })

  const [selectedMatch, setSelectedMatch] = useState('')
  const [scoreA, setScoreA] = useState('')
  const [scoreB, setScoreB] = useState('')
  const [advancer, setAdvancer] = useState('')
  const [errors, setErrors] = useState({})

  // LocalStorage frissítése védetten
  useEffect(() => {
    try {
      window.localStorage.setItem('tipping_predictions', JSON.stringify(predictions))
    } catch (e) {
      console.warn('Hiba a localStorage mentésekor:', e)
    }
  }, [predictions])

  useEffect(() => {
    try {
      window.localStorage.setItem('tipping_userName', userName)
    } catch (e) {
      console.warn('Hiba a localStorage mentésekor:', e)
    }
  }, [userName])

  useEffect(() => {
    const isKnockout = selectedMatch && parseInt(selectedMatch) > 72
    
    // Csak akkor fut le a logika, ha mindkét mező ki van töltve
    if (isKnockout && scoreA !== '' && scoreB !== '') {
      const numA = parseInt(scoreA, 10)
      const numB = parseInt(scoreB, 10)

      if (numA > numB) {
        setAdvancer('A')
        // Ha korábban hiba volt rajta, most levesszük
        setErrors(prev => ({ ...prev, advancer: false }))
      } else if (numB > numA) {
        setAdvancer('B')
        setErrors(prev => ({ ...prev, advancer: false }))
      } else {
        // Döntetlen esetén nullázzuk a továbbjutót, hiszen a játékosnak kell döntenie
        setAdvancer('')
      }
    }
  }, [scoreA, scoreB, selectedMatch])

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
    setFeedbackMsg(null) // Töröljük az esetleges korábbi sikeres üzeneteket
  }

  const handleRemovePrediction = (matchIdToRemove) => {
    setPredictions(predictions.filter((p) => p.matchId !== matchIdToRemove))
  }

  const handleResetExportStatus = () => {
    setPredictions(predictions.map(p => ({ ...p, isExported: false })))
    setFeedbackMsg({ type: 'info', text: 'Státuszok visszaállítva. Most újra elküldheted a tippeket!' })
  }

  // ÚJ UX FUNKCIÓ: A már sikeresen elküldött tippek eltávolítása a listából
  const handleClearExported = () => {
    setPredictions(predictions.filter(p => !p.isExported))
    setFeedbackMsg({ type: 'success', text: 'A már elküldött tippek törölve lettek a nézetből.' })
  }

  const getAvailableGames = () => {
    return games.filter((game) => !predictions.some((p) => parseInt(p.matchId) === parseInt(game.id)))
  }

  const getGameDetails = (matchId) => games.find((g) => parseInt(g.id) === matchId)
  const getUnexportedPredictions = () => predictions.filter(p => !p.isExported)

  const markAsExported = () => {
    setPredictions(predictions.map(p => ({ ...p, isExported: true })))
  }

  // --- EMAILJS KÜLDÉS ---
  const handleSendEmail = async () => {
    const newTips = getUnexportedPredictions()
    if (newTips.length === 0) return

    setIsSendingEmail(true)
    setFeedbackMsg(null)

    const cleanTips = newTips.map(({ isExported, ...rest }) => rest).sort((a, b) => a.matchId - b.matchId)
    const jsonString = JSON.stringify(cleanTips, null, 2)

    try {
      // CSERÉLD KI EZEKET A SAJÁT EMAILJS KULCSAIDRA!
      await emailjs.send(
        'service_hljvhom', 
        'template_fvzn6vj', 
        {
          user_name: userName,
          message: jsonString,
        }, 
        '4fo9IzEUtcoAB0Xyv'
      )
      
      markAsExported()
      setFeedbackMsg({ type: 'success', text: '✅ Tippek sikeresen elküldve! Sok sikert a játékhoz!' })
    } catch (error) {
      console.error('Email küldési hiba:', error)
      setFeedbackMsg({ type: 'error', text: '❌ Hiba történt a küldés során. Kérlek használd a "B terv" gombokat (Másolás vagy Letöltés)!' })
    } finally {
      setIsSendingEmail(false)
    }
  }

  // --- B TERV FUNKCIÓK ---
  const handleDownload = () => {
    const newTips = getUnexportedPredictions()
    if (newTips.length === 0) return
    const cleanTips = newTips.map(({ isExported, ...rest }) => rest).sort((a, b) => a.matchId - b.matchId)
    const json = JSON.stringify({ predictions: cleanTips }, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tipps_${userName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    markAsExported()
    setFeedbackMsg({ type: 'success', text: '✅ Fájl letöltve! Ne felejtsd el elküldeni nekem!' })
  }

  const handleCopyToClipboard = () => {
    const newTips = getUnexportedPredictions()
    if (newTips.length === 0) return
    const cleanTips = newTips.map(({ isExported, ...rest }) => rest).sort((a, b) => a.matchId - b.matchId)
    const json = JSON.stringify({ predictions: cleanTips }, null, 2)
    navigator.clipboard.writeText(json).then(() => {
      markAsExported()
      setFeedbackMsg({ type: 'success', text: '✅ Másolva a vágólapra! Illeszd be az üzenetbe (Ctrl+V)!' })
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

        {/* Központi visszajelző sáv */}
        {feedbackMsg && (
          <Alert severity={feedbackMsg.type} sx={{ mb: 3, mx: 'auto', fontWeight: 600 }}>
            {feedbackMsg.text}
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
          onSendEmail={handleSendEmail}
          onDownload={handleDownload}
          onCopyToClipboard={handleCopyToClipboard}
          unexportedCount={unexportedCount}
          isSending={isSendingEmail}
        />

        <PredictionList
          predictions={predictions}
          onRemovePrediction={handleRemovePrediction}
          isMobile={isMobile}
          getGameDetails={getGameDetails}
        />

        {/* Takarítás és Visszaállítás Szekció */}
        {exportedCount > 0 && (
          <Box sx={{ mt: 3, mb: 4, display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'center' }}>
            <Button
              variant="text"
              startIcon={<ReplayIcon />}
              onClick={handleResetExportStatus}
              sx={{ color: '#888', textTransform: 'none', fontWeight: 600, '&:hover': { background: '#f5f5f5', color: '#1E3932' } }}
            >
              Tippek újra-beküldése ({exportedCount} db)
            </Button>
            
            <Button
              variant="text"
              startIcon={<DeleteSweepIcon />}
              onClick={handleClearExported}
              sx={{ color: '#d32f2f', textTransform: 'none', fontWeight: 600, '&:hover': { background: '#ffebee' } }}
            >
              Már elküldött tippek eltüntetése
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default Tipping