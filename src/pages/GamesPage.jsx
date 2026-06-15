import { useState, useEffect, useMemo } from 'react'
import { 
  Container, 
  Box, 
  Typography, 
  CircularProgress, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Grid,
  Alert
} from '@mui/material'
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import GameList from '../components/GameList'

const GamesPage = () => {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)

  // Szűrők állapotai
  const [filterGroup, setFilterGroup] = useState('all')
  const [filterDate, setFilterDate] = useState('all')

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('https://worldcup26.ir/get/games')
        const data = await response.json()
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

  // Dinamikus opciók kinyerése a betöltött adatokból
  const uniqueGroups = useMemo(() => {
    if (!games.length) return []
    return [...new Set(games.map(g => g.group))].filter(Boolean).sort()
  }, [games])

  const uniqueDates = useMemo(() => {
    if (!games.length) return []
    // Csak az év-hónap-nap részt vesszük ki (pl. "06/13/2026")
    return [...new Set(games.map(g => g.local_date.split(' ')[0]))].filter(Boolean).sort()
  }, [games])

  // Meccsek szűrése a kiválasztott értékek alapján
  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchGroup = filterGroup === 'all' || game.group === filterGroup
      const gameDate = game.local_date.split(' ')[0]
      const matchDate = filterDate === 'all' || gameDate === filterDate
      return matchGroup && matchDate
    })
  }, [games, filterGroup, filterDate])

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

        {/* Szűrő szekció */}
        {!loading && games.length > 0 && (
          <Box 
            sx={{ 
              mb: 4, 
              p: 2, 
              background: '#fff', 
              borderRadius: '12px', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap'
            }}
          >
            <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#1E3932', fontWeight: 'bold' }}>
              <FilterAltIcon /> Szűrés:
            </Typography>

            <Grid container spacing={2} sx={{ flexGrow: 1 }}>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel id="group-filter-label">Csoport / Szakasz</InputLabel>
                  <Select
                    labelId="group-filter-label"
                    value={filterGroup}
                    label="Csoport / Szakasz"
                    onChange={(e) => setFilterGroup(e.target.value)}
                  >
                    <MenuItem value="all"><em>Összes</em></MenuItem>
                    {uniqueGroups.map((group) => (
                      <MenuItem key={group} value={group}>
                        {group.startsWith('R') || group.startsWith('S') || group.startsWith('Q') || group.startsWith('F') 
                          ? `Egyenes kiesés (${group})` 
                          : `${group} Csoport`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel id="date-filter-label">Dátum</InputLabel>
                  <Select
                    labelId="date-filter-label"
                    value={filterDate}
                    label="Dátum"
                    onChange={(e) => setFilterDate(e.target.value)}
                  >
                    <MenuItem value="all"><em>Összes dátum</em></MenuItem>
                    {uniqueDates.map((date) => (
                      <MenuItem key={date} value={date}>{date}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Tartalom */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
            <CircularProgress sx={{ color: '#2E8B57' }} />
          </Box>
        ) : (
          <>
            {filteredGames.length === 0 ? (
              <Alert severity="info" sx={{ mt: 2 }}>Nincs a szűrésnek megfelelő mérkőzés.</Alert>
            ) : (
              <GameList games={filteredGames} />
            )}
          </>
        )}
      </Container>
    </Box>
  )
}

export default GamesPage