// src/components/RegistroPicadoIngreso.js
import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import { auth, db } from '../config/firebaseConfig';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const RegistroPicadoIngreso = () => {
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

  const handleRegistro = async (e) => {
    e.preventDefault();
    setMensaje('');

    const bloqueHorario = determinarBloqueHorario();
    if (bloqueHorario === 'Fuera de Horario') {
      setMensaje('El registro solo se permite en los bloques horarios.');
      return;
    }

    if (!idDocumento) {
      setMensaje('Por favor ingrese un ID de Documento.');
      return;
    }

    try {
      await addDoc(collection(db, 'registrosPicado'), {
        idDocumento,
        bloqueHorario,
        fecha: Timestamp.fromDate(new Date()),
      });
      setMensaje(`Registro realizado exitosamente en ${bloqueHorario}`);
      setIdDocumento('');
    } catch (error) {
      setMensaje('Error al registrar el ingreso');
    }
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
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
      <Typography variant="h4" gutterBottom>Registro de Picado de Ingreso</Typography>
      {mensaje && <Typography color={mensaje.includes('Error') ? 'error' : 'success'}>{mensaje}</Typography>}
      <form onSubmit={handleRegistro}>
        <TextField
          label="ID Documento"
          variant="outlined"
          margin="normal"
          fullWidth
          value={idDocumento}
          onChange={(e) => setIdDocumento(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Registrar Ingreso
        </Button>
      </form>
      <Button onClick={handleLogout} variant="contained" color="secondary" style={{ marginTop: '20px' }}>
        Cerrar Sesión
      </Button>
    </Box>
  );
};

export default RegistroPicadoIngreso;
