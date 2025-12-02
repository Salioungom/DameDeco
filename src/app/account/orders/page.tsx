'use client';

import { RequireRole } from '@/components/RequireRole';
import { useAuth } from '@/contexts/AuthContext';
import {
    Typography,
    Container,
    Paper,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
} from '@mui/material';

// Mock orders data
const mockOrders = [
    {
        id: '1',
        date: '2025-11-20',
        total: 150.00,
        status: 'delivered' as const,
        items: 3,
    },
    {
        id: '2',
        date: '2025-11-25',
        total: 280.50,
        status: 'processing' as const,
        items: 5,
    },
    {
        id: '3',
        date: '2025-11-27',
        total: 95.00,
        status: 'pending' as const,
        items: 2,
    },
];

const statusColors: Record<string, 'success' | 'warning' | 'info' | 'default' | 'error'> = {
    delivered: 'success',
    processing: 'info',
    pending: 'warning',
    cancelled: 'error',
    shipped: 'info',
};

const statusLabels: Record<string, string> = {
    delivered: 'Livré',
    processing: 'En cours',
    pending: 'En attente',
    cancelled: 'Annulé',
    shipped: 'Expédié',
};

function OrdersContent() {
    const { user } = useAuth();

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Mes Commandes
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Historique de vos commandes
                </Typography>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>N° Commande</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Articles</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell>Statut</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mockOrders.map((order) => (
                                <TableRow key={order.id} hover>
                                    <TableCell>#{order.id}</TableCell>
                                    <TableCell>{new Date(order.date).toLocaleDateString('fr-FR')}</TableCell>
                                    <TableCell>{order.items}</TableCell>
                                    <TableCell>{order.total.toFixed(2)} €</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={statusLabels[order.status]}
                                            color={statusColors[order.status]}
                                            size="small"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {mockOrders.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body1" color="text.secondary">
                            Vous n'avez pas encore de commandes
                        </Typography>
                    </Box>
                )}
            </Paper>
        </Container>
    );
}

export default function OrdersPage() {
    return (
        <RequireRole allowedRoles={['client']}>
            <OrdersContent />
        </RequireRole>
    );
}
