'use client';

import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import {
    Container,
    Typography,
    Paper,
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, clearCart } = useStore();
    const router = useRouter();

    const total = cart.reduce((sum, item) => {
        const price = item.priceType === 'wholesale' ? item.product.wholesalePrice : item.product.price;
        return sum + price * item.quantity;
    }, 0);

    const handleCheckout = () => {
        router.push('/checkout');
    };

    if (cart.length === 0) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h5" gutterBottom>
                        Votre panier est vide
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => router.push('/shop')}
                        sx={{ mt: 2 }}
                    >
                        Continuer vos achats
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Mon Panier
            </Typography>

            <Paper sx={{ mt: 3 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Produit</TableCell>
                                <TableCell>Prix</TableCell>
                                <TableCell>Quantité</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cart.map((item, index) => {
                                const price = item.priceType === 'wholesale'
                                    ? item.product.wholesalePrice
                                    : item.product.price;
                                const itemTotal = price * item.quantity;

                                return (
                                    <TableRow key={`${item.product.id}-${index}`}>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <img
                                                    src={item.product.image}
                                                    alt={item.product.name}
                                                    style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                                                />
                                                <Box>
                                                    <Typography variant="body1">{item.product.name}</Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {item.priceType === 'wholesale' ? 'Prix gros' : 'Prix détail'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{price.toFixed(2)} €</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                                                >
                                                    <RemoveIcon />
                                                </IconButton>
                                                <Typography>{item.quantity}</Typography>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                >
                                                    <AddIcon />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{itemTotal.toFixed(2)} €</TableCell>
                                        <TableCell>
                                            <IconButton
                                                color="error"
                                                onClick={() => removeFromCart(item.product.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={clearCart}
                    >
                        Vider le panier
                    </Button>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h5" gutterBottom>
                            Total: {total.toFixed(2)} €
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={() => router.push('/shop')}
                            >
                                Continuer vos achats
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleCheckout}
                            >
                                Passer la commande
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}
