import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, Chip } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

// Ugyanaz a poénszámító logika, mint a Leaderboardban
const calculatePoints = (actualA, actualB, predA, predB) => {
  if (actualA === predA && actualB === predB) return 3
  const actualResult = actualA > actualB ? 'A' : actualA < actualB ? 'B' : 'D'
  const predResult = predA > predB ? 'A' : predA < predB ? 'B' : 'D'
  if (actualResult === predResult) return 1
  return 0
}

const UserTipsModal = ({ open, onClose, user, predictions, games }) => {
  if (!user) return null

  // Csak az adott felhasználó tippjeinek kiszűrése
  const userTips = predictions.filter(p => p.user === user)

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth 
      PaperProps={{ 
        sx: { borderRadius: '16px', overflow: 'hidden' } 
      }}
    >
      <DialogTitle 
        sx={{ 
          background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.warning.main} 100%)`, 
          color: '#fff', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          p: 3
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          👤 {user} tippjei
        </Typography>
        <IconButton onClick={onClose} sx={{ color: '#fff' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0, background: '#f8f9fa' }}>
        {userTips.length === 0 ? (
          <Typography sx={{ p: 4, textAlign: 'center', color: '#666', fontWeight: 600 }}>
            Nincsenek még leadott tippek.
          </Typography>
        ) : (
          userTips.map((tip, index) => {
            const game = games.find(g => parseInt(g.id) === tip.matchId)
            if (!game) return null

            const isFinished = game.finished === true || String(game.finished).toUpperCase() === 'TRUE'
            let points = 0
            
            if (isFinished) {
              points = calculatePoints(parseInt(game.home_score), parseInt(game.away_score), tip.scoreA, tip.scoreB)
            }

            return (
              <Box 
                key={index} 
                sx={{ 
                  p: 3, 
                  borderBottom: '1px solid #e0e0e0', 
                  background: isFinished 
                    ? (points === 3 ? 'rgba(0, 255, 135, 0.1)' : points === 1 ? 'rgba(0, 229, 255, 0.1)' : 'rgba(255, 0, 77, 0.05)') 
                    : '#fff' 
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main', mb: 1.5 }}>
                  #{game.id} - {game.home_team_name_en} vs {game.away_team_name_en}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600, mb: 0.5 }}>
                      Tipp: <span style={{ color: '#FF004D', fontWeight: 800 }}>{tip.scoreA} - {tip.scoreB}</span>
                    </Typography>
                    {isFinished && (
                      <Typography variant="body2" sx={{ color: '#666', fontWeight: 600 }}>
                        Eredmény: {game.home_score} - {game.away_score}
                      </Typography>
                    )}
                  </Box>
                  
                  {isFinished ? (
                    <Chip 
                      label={`${points} pont`} 
                      sx={{ 
                        // 3 pont: Lime zöld, 1 pont: Ciánkék, 0 pont: Magenta
                        background: points === 3 ? 'success.main' : (points === 1 ? 'info.main' : 'secondary.main'), 
                        color: points === 1 ? '#000' : '#fff', 
                        fontWeight: 800,
                        fontSize: '0.9rem'
                      }} 
                    />
                  ) : (
                    <Chip 
                      label="Hamarosan" 
                      size="small" 
                      sx={{ background: '#e0e0e0', color: '#666', fontWeight: 700 }} 
                    />
                  )}
                </Box>
              </Box>
            )
          })
        )}
      </DialogContent>
    </Dialog>
  )
}

export default UserTipsModal