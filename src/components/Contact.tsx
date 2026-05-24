'use client';

import { useState } from 'react';
import {
  Box, Container, Typography, TextField, Button,
  Stack, Accordion, AccordionSummary, AccordionDetails,
  Snackbar, Alert, CircularProgress,
} from '@mui/material';
import {
  Email, Phone, LocationOn, Send, WhatsApp,
  Facebook, Instagram, Twitter, AccessTime, ExpandMore,
} from '@mui/icons-material';

const C = {
  primary:'#185FA5', dark:'#042C53', light:'#E6F1FB',
  surface:'#F5F9FE', border:'#E6F1FB', muted:'#888780', text:'#5F5E5A',
} as const;

const CONTACT_ITEMS = [
  { icon:<Phone sx={{fontSize:17,color:C.primary}}/>, label:'Téléphone', value:'+221 77 XXX XX XX', sub:'Lun – Sam · 9h–18h' },
  { icon:<Email sx={{fontSize:17,color:C.primary}}/>, label:'Email', value:'contact@damesarr.sn', sub:'Réponse sous 24h' },
  { icon:<LocationOn sx={{fontSize:17,color:C.primary}}/>, label:'Adresse', value:'Dakar, Sénégal', sub:'Quartier des affaires' },
];

const SOCIALS = [
  { icon:<WhatsApp sx={{fontSize:16}}/>, label:'WhatsApp', color:'#25D366' },
  { icon:<Facebook sx={{fontSize:16}}/>, label:'Facebook', color:'#1877F2' },
  { icon:<Instagram sx={{fontSize:16}}/>, label:'Instagram', color:'#E4405F' },
  { icon:<Twitter sx={{fontSize:16}}/>, label:'Twitter', color:'#1DA1F2' },
];

const FAQS = [
  { q:"Quels sont vos délais de livraison ?", a:"2–5 jours ouvrables sur Dakar et banlieue, 5–10 jours pour les autres régions. Commandes sur mesure : +2–3 semaines." },
  { q:"Proposez-vous des prix de gros ?", a:"Oui. Contactez notre service commercial pour un devis personnalisé selon vos volumes." },
  { q:"Quelles sont vos méthodes de paiement ?", a:"Wave, Orange Money, virement bancaire, paiement à la livraison. Facilités possibles pour grosses commandes." },
  { q:"Puis-je retourner un article ?", a:"14 jours pour retourner un article non utilisé dans son emballage d'origine. Frais à la charge du client sauf défaut de fabrication." },
  { q:"Livrez-vous en dehors de Dakar ?", a:"Oui, dans tout le Sénégal. Des frais supplémentaires peuvent s'appliquer selon la distance." },
  { q:"Comment passer commande par WhatsApp ?", a:"Cliquez sur le bouton WhatsApp, envoyez la référence produit + quantité. Notre équipe vous répond rapidement." },
];

interface FormData { name:string; email:string; subject:string; message:string }
interface FormErrors { name?:string; email?:string; subject?:string; message?:string }

export default function ContactPage() {
  const [form, setForm] = useState<FormData>({name:'',email:'',subject:'',message:''});
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({open:false,msg:'',ok:true});

  const validate = () => {
    const e: FormErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Nom requis (min 2 caractères)';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email invalide';
    if (!form.subject.trim()) e.subject = 'Sujet requis';
    if (!form.message.trim() || form.message.trim().length < 10) e.message = 'Message requis (min 10 caractères)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) { setSnack({open:true,msg:'Veuillez corriger les erreurs',ok:false}); return; }
    setLoading(true);
    setTimeout(() => {
      setSnack({open:true,msg:'Message envoyé ! Nous vous répondrons sous 24h.',ok:true});
      setForm({name:'',email:'',subject:'',message:''});
      setErrors({});
      setLoading(false);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    const {name,value} = e.target;
    setForm(p => ({...p,[name]:value}));
    if (errors[name as keyof FormErrors]) setErrors(p => ({...p,[name]:undefined}));
  };

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius:'8px', fontSize:13,
      '& fieldset': {borderColor:C.border},
      '&:hover fieldset': {borderColor:'#85B7EB'},
      '&.Mui-focused fieldset': {borderColor:C.primary, borderWidth:1.5},
    },
    '& .MuiInputLabel-root': {fontSize:13, color:C.muted},
    '& .MuiInputLabel-root.Mui-focused': {color:C.primary},
  };

  return (
    <Box sx={{minHeight:'100vh', bgcolor:'#fff'}}>

      {/* ── HERO compact ── */}
      <Box sx={{bgcolor:C.surface, borderBottom:`1px solid ${C.border}`, pt:{xs:10,md:13}, pb:{xs:6,md:8}}}>
        <Container maxWidth="md" sx={{textAlign:'center'}}>
          <Box sx={{display:'inline-flex',alignItems:'center',gap:0.75,bgcolor:C.light,border:`1px solid ${C.border}`,borderRadius:'20px',px:1.5,py:0.5,mb:3}}>
            <Box sx={{width:6,height:6,borderRadius:'50%',bgcolor:'#22c55e'}}/>
            <Typography sx={{fontSize:11,fontWeight:600,color:'#0C447C',letterSpacing:'0.8px',textTransform:'uppercase'}}>
              Contactez-nous
            </Typography>
          </Box>
          <Typography component="h1" sx={{fontSize:{xs:'2rem',md:'2.75rem'},fontWeight:800,color:C.dark,letterSpacing:'-0.03em',lineHeight:1.1,mb:2}}>
            Parlons de <Box component="span" sx={{color:C.primary}}>votre projet</Box>
          </Typography>
          <Typography sx={{fontSize:{xs:14,md:15},color:C.text,lineHeight:1.8,maxWidth:560,mx:'auto'}}>
            Une question ? Besoin d'un devis ? Notre équipe est disponible du lundi au samedi pour vous accompagner.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{px:{xs:2,md:6},py:{xs:6,md:8}}}>

        {/* ── GRILLE principale ── */}
        <Box sx={{display:'grid',gridTemplateColumns:{xs:'1fr',md:'300px 1fr'},gap:{xs:4,md:6},mb:8}}>

          {/* Coordonnées */}
          <Box sx={{display:'flex',flexDirection:'column',gap:1.5}}>
            <Typography sx={{fontSize:11,fontWeight:600,color:C.muted,letterSpacing:'0.8px',textTransform:'uppercase',mb:1}}>
              Nos coordonnées
            </Typography>
            {CONTACT_ITEMS.map(item => (
              <Box key={item.label} sx={{display:'flex',alignItems:'center',gap:1.5,bgcolor:C.surface,border:`1px solid ${C.border}`,borderRadius:'10px',px:2,py:1.5}}>
                <Box sx={{width:36,height:36,borderRadius:'9px',bgcolor:C.light,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  {item.icon}
                </Box>
                <Box>
                  <Typography sx={{fontSize:11,color:C.muted}}>{item.label}</Typography>
                  <Typography sx={{fontSize:13,fontWeight:600,color:C.dark}}>{item.value}</Typography>
                  <Typography sx={{fontSize:11,color:C.muted,display:'flex',alignItems:'center',gap:0.5}}>
                    <AccessTime sx={{fontSize:11}}/>{item.sub}
                  </Typography>
                </Box>
              </Box>
            ))}

            {/* Réseaux sociaux */}
            <Box sx={{mt:1}}>
              <Typography sx={{fontSize:11,fontWeight:600,color:C.muted,letterSpacing:'0.8px',textTransform:'uppercase',mb:1.5}}>
                Réseaux sociaux
              </Typography>
              <Box sx={{display:'flex',flexWrap:'wrap',gap:0.75}}>
                {SOCIALS.map(s => (
                  <Box key={s.label} sx={{display:'flex',alignItems:'center',gap:0.625,border:`1px solid ${C.border}`,borderRadius:'7px',px:1.25,py:0.625,cursor:'pointer','&:hover':{borderColor:s.color,bgcolor:'rgba(0,0,0,0.02)'}}}>
                    <Box sx={{color:s.color,display:'flex'}}>{s.icon}</Box>
                    <Typography sx={{fontSize:12,fontWeight:500,color:C.text}}>{s.label}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Formulaire */}
          <Box sx={{bgcolor:'#fff',border:`1px solid ${C.border}`,borderRadius:'14px',p:{xs:3,md:4}}}>
            <Typography sx={{fontSize:16,fontWeight:700,color:C.dark,mb:0.5}}>Envoyez-nous un message</Typography>
            <Typography sx={{fontSize:13,color:C.muted,mb:3}}>Notre équipe vous répondra dans les plus brefs délais.</Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <Box sx={{display:'flex',gap:2,flexDirection:{xs:'column',sm:'row'}}}>
                  <TextField fullWidth label="Nom complet" name="name" value={form.name} onChange={handleChange} error={!!errors.name} helperText={errors.name} disabled={loading} size="small" sx={fieldSx}/>
                  <TextField fullWidth label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} disabled={loading} size="small" sx={fieldSx}/>
                </Box>
                <TextField fullWidth label="Sujet" name="subject" value={form.subject} onChange={handleChange} error={!!errors.subject} helperText={errors.subject} disabled={loading} size="small" sx={fieldSx}/>
                <TextField fullWidth label="Message" name="message" multiline rows={5} value={form.message} onChange={handleChange} error={!!errors.message} helperText={errors.message} disabled={loading} sx={fieldSx}/>
                <Button
                  type="submit" variant="contained" disabled={loading}
                  endIcon={loading ? <CircularProgress size={16} color="inherit"/> : <Send sx={{fontSize:16}}/>}
                  sx={{
                    alignSelf:'flex-start', bgcolor:C.primary, color:'#fff',
                    borderRadius:'9px', px:3.5, py:1.375, fontSize:13,
                    fontWeight:700, textTransform:'none', boxShadow:'none',
                    '&:hover':{bgcolor:C.dark,boxShadow:'none'},
                    '&:disabled':{bgcolor:'#B5D4F4',color:'#fff'},
                  }}
                >
                  {loading ? 'Envoi…' : 'Envoyer le message'}
                </Button>
              </Stack>
            </Box>
          </Box>
        </Box>

        {/* ── FAQ ── */}
        <Box sx={{maxWidth:760,mx:'auto',mb:8}}>
          <Box sx={{mb:4}}>
            <Typography sx={{fontSize:11,fontWeight:600,color:C.primary,letterSpacing:'1px',textTransform:'uppercase',mb:1}}>FAQ</Typography>
            <Typography component="h2" sx={{fontSize:{xs:22,md:26},fontWeight:700,color:C.dark,letterSpacing:'-0.3px',mb:0.5}}>Questions fréquentes</Typography>
            <Typography sx={{fontSize:14,color:C.muted}}>Trouvez rapidement les réponses aux questions courantes.</Typography>
          </Box>
          <Stack spacing={1}>
            {FAQS.map((faq,i) => (
              <Accordion key={i} elevation={0} disableGutters sx={{
                border:`1px solid ${C.border}`,borderRadius:'10px !important',
                overflow:'hidden','&:before':{display:'none'},
                '&.Mui-expanded':{borderColor:'#85B7EB'},
              }}>
                <AccordionSummary expandIcon={<ExpandMore sx={{fontSize:18,color:C.primary}}/>} sx={{px:2.5,py:0,minHeight:52,'&.Mui-expanded':{minHeight:52},'& .MuiAccordionSummary-content':{my:1.75}}}>
                  <Typography sx={{fontSize:13,fontWeight:600,color:C.dark}}>{faq.q}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{px:2.5,pt:0,pb:2.5,borderTop:`1px solid ${C.border}`}}>
                  <Typography sx={{fontSize:13,color:C.text,lineHeight:1.75}}>{faq.a}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </Box>

        {/* ── Carte ── */}
        <Box sx={{maxWidth:900,mx:'auto',mb:4}}>
          <Box sx={{mb:3}}>
            <Typography sx={{fontSize:11,fontWeight:600,color:C.primary,letterSpacing:'1px',textTransform:'uppercase',mb:1}}>Localisation</Typography>
            <Typography component="h2" sx={{fontSize:{xs:20,md:24},fontWeight:700,color:C.dark}}>Nous trouver à Dakar</Typography>
          </Box>
          <Box sx={{border:`1px solid ${C.border}`,borderRadius:'14px',overflow:'hidden',height:{xs:280,md:380}}}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d61681.33063469812!2d-17.497849!3d14.7167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xec10d7f729c37d5%3A0x4c3f03b804b572d!2sDakar%2C%20Senegal!5e0!3m2!1sfr!2ssn!4v1234567890"
              width="100%" height="100%" style={{border:0,display:'block'}}
              allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            />
          </Box>
        </Box>

      </Container>

      <Snackbar open={snack.open} autoHideDuration={6000} onClose={()=>setSnack(p=>({...p,open:false}))} anchorOrigin={{vertical:'bottom',horizontal:'right'}}>
        <Alert severity={snack.ok?'success':'error'} variant="filled" onClose={()=>setSnack(p=>({...p,open:false}))} sx={{borderRadius:'10px',fontSize:13}}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}