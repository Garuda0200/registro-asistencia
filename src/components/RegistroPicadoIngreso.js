// src/components/RegistroPicadoIngreso.js
import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Button, Typography, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { auth, db } from '../config/firebaseConfig';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const RegistroPicadoIngreso = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [idDocumento, setIdDocumento] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/'); // Redirige al login si no hay sesión activa
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const determinarBloqueHorario = () => {
    const horaActual = new Date().getHours();
    if (horaActual >= 8 && horaActual < 12) {
      return 'Bloque 1 (8:00 am - 12:00 pm)';
    } else if (horaActual >= 13 && horaActual < 17) {
      return 'Bloque 2 (1:00 pm - 5:00 pm)';
    } else {
      return 'Fuera de Horario';
    }
  };

  const handleRegistro = async (documentId) => {
    const bloqueHorario = determinarBloqueHorario();
    if (bloqueHorario === 'Fuera de Horario') {
      setMensaje('El registro solo se permite en los bloques horarios.');
      return;
    }

    if (!documentId) {
      setMensaje('Por favor ingrese un ID de Documento válido.');
      return;
    }

    try {
      await addDoc(collection(db, 'registrosPicado'), {
        idDocumento: documentId,
        bloqueHorario,
        fecha: Timestamp.fromDate(new Date()),
      });
      setMensaje(`Registro realizado exitosamente en ${bloqueHorario}`);
      setIdDocumento('');
      setOpenModal(false);
    } catch (error) {
      setMensaje('Error al registrar el ingreso');
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuClick}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Registro de Picado de Asistencia
          </Typography>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => navigate('/')}>Inicio</MenuItem>
            <MenuItem onClick={() => navigate('/reportes')}>Reportes</MenuItem>
            <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="80vh" textAlign="center">
        
        {/* Imagen de Logo Circular */}
        <Avatar
          src="/ruta/del/logo.png" // Asegúrate de cambiar esta ruta al logo que deseas usar
          alt="Logo"
          sx={{ width: 100, height: 100, mb: 4 }}
        />

        {/* Mensaje de Estado */}
        {mensaje && <Typography color={mensaje.includes('Error') ? 'error' : 'success'} sx={{ mb: 2 }}>{mensaje}</Typography>}
        
        {/* Botón para el escáner (implementaremos la funcionalidad después) */}
        <Button variant="contained" color="primary" onClick={() => setMensaje("Funcionalidad de escaneo no implementada aún")} fullWidth sx={{ maxWidth: 300, mb: 2 }}>
          Registrar Asistencia con Escáner
        </Button>
        
        {/* Botón para abrir el modal de DNI */}
        <Button variant="contained" color="secondary" onClick={handleOpenModal} fullWidth sx={{ maxWidth: 300 }}>
          Registrar Asistencia con DNI
        </Button>

        {/* Modal para ingresar DNI */}
        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>Registrar Asistencia con DNI</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Por favor, ingrese su número de DNI para registrar la asistencia.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="DNI"
              fullWidth
              variant="outlined"
              value={idDocumento}
              onChange={(e) => setIdDocumento(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
              Cancelar
            </Button>
            <Button onClick={() => handleRegistro(idDocumento)} color="primary">
              Registrar Asistencia
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default RegistroPicadoIngreso;
