import { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Rating, 
  Avatar, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  IconButton,
  Divider,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Alert,
  Snackbar
} from '@mui/material';
import { 
  Star as StarIcon, 
  ThumbUp as ThumbUpIcon, 
  CheckCircle as CheckCircleIcon, 
  Message as MessageIcon,
  Close as CloseIcon
} from '@mui/icons-material';

interface Review {
  id: string;
  name: string;
  email?: string;
  rating: number;
  comment: string;
  date: string;
  helpful?: number;
  verified?: boolean;
}

interface ProductReviewsProps {
  productId: string;
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'date' | 'helpful'>) => void;
}

export function ProductReviews({ productId, reviews = [], onAddReview }: ProductReviewsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rating, setRating] = useState<number | null>(5);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [helpfulReviews, setHelpfulReviews] = useState<Record<string, boolean>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !comment) {
      setSnackbar({
        open: true,
        message: 'Veuillez remplir tous les champs obligatoires',
        severity: 'error'
      });
      return;
    }

    if (comment.length < 10) {
      setSnackbar({
        open: true,
        message: 'Votre commentaire doit contenir au moins 10 caractères',
        severity: 'error'
      });
      return;
    }

    onAddReview({
      name,
      email,
      rating: rating || 5,
      comment,
    });

    // Réinitialiser le formulaire
    setName('');
    setEmail('');
    setComment('');
    setRating(5);
    setIsDialogOpen(false);
    
    setSnackbar({
      open: true,
      message: 'Merci pour votre avis !',
      severity: 'success'
    });
  };

  const handleHelpfulClick = (reviewId: string) => {
    setHelpfulReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }).format(date);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      {/* En-tête avec statistiques */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: 2, 
          mb: 2 
        }}>
          <Box>
            <Typography variant="h4" component="h2" gutterBottom>
              Avis clients
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {reviews.length} {reviews.length > 1 ? 'avis' : 'avis'} · Note moyenne: {averageRating}/5
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<MessageIcon />}
            onClick={() => setIsDialogOpen(true)}
          >
            Donner votre avis
          </Button>
        </Box>

        {/* Formulaire d'ajout d'avis */}
        <Dialog 
          open={isDialogOpen} 
          onClose={() => setIsDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <form onSubmit={handleSubmit}>
            <DialogTitle>Donnez votre avis</DialogTitle>
            <DialogContent>
              {/* Note par étoiles */}
              <Box sx={{ mb: 2, pt: 2 }}>
                <Typography variant="body1" gutterBottom>Votre note *</Typography>
                <Rating
                  value={rating}
                  onChange={(_: React.SyntheticEvent, newValue: number | null) => setRating(newValue || 0)}
                  icon={<StarIcon fontSize="inherit" />}
                  emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                />
              </Box>

              {/* Nom */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" gutterBottom>Votre nom *</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                  required
                />
              </Box>

              {/* Email (optionnel) */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" gutterBottom>
                  Email <Typography component="span" color="text.secondary">(optionnel)</Typography>
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  type="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                />
              </Box>

              {/* Commentaire */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" gutterBottom>Votre avis *</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={4}
                  value={comment}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setComment(e.target.value)}
                  required
                  helperText="Votre commentaire doit contenir au moins 10 caractères"
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
              >
                Publier mon avis
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>

      {/* Liste des avis */}
      <List>
        {reviews.map((review) => (
          <Card key={review.id} sx={{ mb: 2, boxShadow: 3 }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {review.name.charAt(0).toUpperCase()}
                </Avatar>
              }
              title={review.name}
              subheader={formatDate(review.date)}
              action={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating
                    value={review.rating}
                    readOnly
                    icon={<StarIcon fontSize="inherit" />}
                  />
                  {review.verified && (
                    <CheckCircleIcon 
                      color="primary" 
                      sx={{ ml: 1 }} 
                      titleAccess="Avis vérifié"
                    />
                  )}
                </Box>
              }
            />
            <CardContent>
              <Typography variant="body1" paragraph>
                {review.comment}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <IconButton 
                  size="small" 
                  color={helpfulReviews[review.id] ? 'primary' : 'default'}
                  onClick={() => handleHelpfulClick(review.id)}
                >
                  <ThumbUpIcon fontSize="small" />
                </IconButton>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  {review.helpful || 0} personne(s) ont trouvé cet avis utile
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </List>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity as 'success' | 'error'}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
