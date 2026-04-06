'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import {
    Box,
    TextField,
    Button,
    Alert,
    IconButton,
    InputAdornment,
    Typography,
    CircularProgress,
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Person,
    Email,
    Phone,
} from '@mui/icons-material';

// Schéma de validation Zod
const registerSchema = z.object({
    fullName: z.string()
        .min(2, 'Le nom complet doit contenir au moins 2 caractères')
        .max(100, 'Le nom complet ne peut pas dépasser 100 caractères'),
    email: z.string()
        .email('L\'adresse email n\'est pas valide')
        .optional()
        .or(z.literal('')),
    phone: z.string()
        .regex(/^\+221(77|78|70|76|33)\d{7}$/, 'Le numéro de téléphone doit être au format sénégalais (+22177XXXXXXX)')
        .optional()
        .or(z.literal('')),
    password: z.string()
        .min(12, 'Le mot de passe doit contenir au moins 12 caractères')
        .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une lettre majuscule')
        .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une lettre minuscule')
        .regex(/\d/, 'Le mot de passe doit contenir au moins un chiffre')
        .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Le mot de passe doit contenir au moins un caractère spécial'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
}).refine((data) => data.email || data.phone, {
    message: 'Au moins l\'email ou le téléphone doit être renseigné',
    path: ['email'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
    onSuccess?: (user: any) => void;
    redirectTo?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, redirectTo }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setError: setFormError,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: 'onChange',
    });

    const watchedPassword = watch('password');

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const onSubmit = async (data: RegisterFormData) => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // Préparer les données pour l'API
            const apiData = {
                fullName: data.fullName,
                email: data.email || null,
                phone: data.phone || null,
                password: data.password,
                confirmPassword: data.confirmPassword,
            };

            const response = await axios.post('/api/v1/auth/register', apiData);

            if (response.data) {
                setSuccess('Inscription réussie ! Redirection...');
                setTimeout(() => {
                    if (onSuccess) {
                        onSuccess(response.data.user);
                    }
                    if (redirectTo) {
                        window.location.href = redirectTo;
                    }
                }, 2000);
            }
        } catch (err: any) {
            console.error('Erreur d\'inscription:', err);
            
            // Gérer les erreurs 422 de l'API
            if (err.response?.status === 422) {
                const errorData = err.response.data;
                
                if (errorData.detail && Array.isArray(errorData.detail)) {
                    // Extraire les messages d'erreur détaillés
                    const fieldErrors: { [key: string]: string } = {};
                    
                    errorData.detail.forEach((errorDetail: any) => {
                        const fieldName = errorDetail.loc?.[1];
                        const errorMessage = errorDetail.msg;
                        
                        if (fieldName && errorMessage) {
                            fieldErrors[fieldName] = errorMessage;
                            // Mettre à jour l'erreur dans le formulaire
                            setFormError(fieldName as keyof RegisterFormData, {
                                type: 'server',
                                message: errorMessage,
                            });
                        }
                    });
                    
                    // Si aucun champ spécifique n'est identifié, afficher l'erreur générale
                    if (Object.keys(fieldErrors).length === 0) {
                        setError(errorData.detail[0]?.msg || 'Erreur de validation');
                    }
                } else if (errorData.detail && typeof errorData.detail === 'string') {
                    setError(errorData.detail);
                } else if (errorData.message) {
                    setError(errorData.message);
                } else {
                    setError('Une erreur est survenue lors de l\'inscription');
                }
            } else {
                setError(err.message || 'Une erreur est survenue lors de l\'inscription');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Message d'erreur global */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Message de succès */}
            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                </Alert>
            )}

            {/* Champ Nom complet */}
            <TextField
                {...register('fullName')}
                label="Nom complet"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.fullName}
                helperText={errors.fullName?.message}
                disabled={loading}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Person color="action" />
                        </InputAdornment>
                    ),
                }}
            />

            {/* Champ Email */}
            <TextField
                {...register('email')}
                label="Adresse email"
                type="email"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.email}
                helperText={errors.email?.message}
                disabled={loading}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Email color="action" />
                        </InputAdornment>
                    ),
                }}
            />

            {/* Champ Téléphone */}
            <TextField
                {...register('phone')}
                label="Téléphone (+22177XXXXXXX)"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.phone}
                helperText={errors.phone?.message}
                disabled={loading}
                placeholder="+22177XXXXXXX"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Phone color="action" />
                        </InputAdornment>
                    ),
                }}
            />

            {/* Champ Mot de passe */}
            <TextField
                {...register('password')}
                label="Mot de passe"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.password}
                helperText={errors.password?.message}
                disabled={loading}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={togglePasswordVisibility}
                                edge="end"
                                disabled={loading}
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            {/* Champ Confirmation mot de passe */}
            <TextField
                {...register('confirmPassword')}
                label="Confirmer le mot de passe"
                type={showConfirmPassword ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                disabled={loading}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={toggleConfirmPasswordVisibility}
                                edge="end"
                                disabled={loading}
                            >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            {/* Bouton de soumission */}
            <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                }}
            >
                {loading ? (
                    <Box display="flex" alignItems="center" gap={1}>
                        <CircularProgress size={20} color="inherit" />
                        <span>Inscription en cours...</span>
                    </Box>
                ) : (
                    "S'inscrire"
                )}
            </Button>

            {/* Indications sur les champs requis */}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                * Au moins l'email ou le téléphone doit être renseigné
            </Typography>
        </Box>
    );
};

export default RegisterForm;
