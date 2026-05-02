// Phone validation utilities for Senegal (+221) and Gambia (+220)

export const validatePhone = (phone: string): string | null => {
  if (!phone) {
    return "Le numéro de téléphone est requis";
  }

  // Nettoyer le numéro
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');

  // Vérifier l'indicatif
  if (!cleaned.startsWith('+221') && !cleaned.startsWith('+220')) {
    return "Le numéro doit être sénégalais (+221) ou gambien (+220)";
  }

  // Validation Sénégal
  if (cleaned.startsWith('+221')) {
    if (cleaned.length !== 14) {
      return "Format invalide: +221 suivi de 9 chiffres";
    }

    const operatorPrefix = cleaned.substring(4, 6);
    const validSenegalOperators = ['77', '78', '76', '70', '75', '33', '30'];

    if (!validSenegalOperators.includes(operatorPrefix)) {
      return `Opérateur invalide. Valides: ${validSenegalOperators.join(', ')}`;
    }
  }

  // Validation Gambie
  if (cleaned.startsWith('+220')) {
    if (cleaned.length !== 12) {
      return "Format invalide: +220 suivi de 7 chiffres";
    }

    const operatorPrefix = cleaned.substring(4, 6);
    const validGambiaOperators = ['30', '39', '99', '77', '88', '55', '22'];

    if (!validGambiaOperators.includes(operatorPrefix)) {
      return `Opérateur invalide. Valides: ${validGambiaOperators.join(', ')}`;
    }
  }

  return null; // Validation OK
};

export const formatPhoneInput = (value: string): string => {
  // Enlever tout sauf les chiffres et le +
  let cleaned = value.replace(/[^\d+]/g, '');

  // Ajouter automatiquement +221 si l'utilisateur commence par un chiffre
  if (!cleaned.startsWith('+') && cleaned.length > 0) {
    cleaned = '+221' + cleaned;
  }

  // Formatage visuel avec espaces (optionnel)
  if (cleaned.startsWith('+221') && cleaned.length > 4) {
    cleaned = cleaned.replace(/(\+221)(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  } else if (cleaned.startsWith('+220') && cleaned.length > 4) {
    cleaned = cleaned.replace(/(\+220)(\d{2})(\d{3})(\d{2})/, '$1 $2 $3 $4');
  }

  return cleaned;
};

export const detectCountry = (phone: string): 'SN' | 'GM' | null => {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  if (cleaned.startsWith('+221')) return 'SN';
  if (cleaned.startsWith('+220')) return 'GM';
  return null;
};

export const getOperators = (country: 'SN' | 'GM'): string[] => {
  if (country === 'SN') {
    return ['77', '78', '76', '70', '75', '33', '30'];
  }
  return ['30', '39', '99', '77', '88', '55', '22'];
};
