import { useState, useEffect } from 'react'
import { Container, Box, Typography, CircularProgress } from '@mui/material'
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'
import GameList from '../components/GameList' // Állítsd be a helyes útvonalat a projektedhez!

const GamesPage = () => {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('https://worldcup26.ir/get/games')
        const data = await response.json()
        
        // Meccsek rendezése ID alapján (vagy dátum alapján)
        const sortedGames = (data.games || data).sort((a, b) => parseInt(a.id) - parseInt(b.id))
        setGames(sortedGames)
      } catch (error) {
        console.error('Hiba a meccsek lekérésekor:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, [])

  return (
    <Box sx={{ minHeight: '100vh', background: '#f5f5f5', py: { xs: 3, sm: 5 } }}>
      <Container maxWidth="lg">
        {/* Fejléc */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: '#1E3932',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.5,
              fontSize: { xs: '2rem', sm: '3rem' }
            }}
          >
            <SportsSoccerIcon sx={{ fontSize: { xs: '2rem', sm: '3rem' } }} />
            Mérkőzések
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#666', mt: 1 }}>
            A 2026-os Világbajnokság összes mérkőzése és eredménye
          </Typography>
        </Box>

        {/* Tartalom */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
            <CircularProgress sx={{ color: '#2E8B57' }} />
          </Box>
        ) : (
          <GameList games={games} />
        )}
      </Container>
    </Box>
  )
}

export default GamesPage