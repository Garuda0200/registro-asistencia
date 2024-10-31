// src/components/Reportes.js
import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import { db } from '../config/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

const Reportes = () => {
  const [fecha, setFecha] = useState('');
  const [registros, setRegistros] = useState([]);
  const [mensaje, setMensaje] = useState('');

  const handleBuscar = async () => {
    setMensaje('');
    setRegistros([]);

    if (!fecha) {
      setMensaje('Por favor selecciona una fecha');
      return;
    }

    try {
      const fechaInicio = new Date(fecha);
      const fechaFin = new Date(fecha);
      fechaFin.setDate(fechaFin.getDate() + 1); // Incrementa un día para cubrir las 24 horas

      const q = query(
        collection(db, 'registrosPicado'),
        where('fecha', '>=', fechaInicio),
        where('fecha', '<', fechaFin)
      );

      const querySnapshot = await getDocs(q);
      const registrosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRegistros(registrosData);
      if (registrosData.length === 0) setMensaje('No se encontraron registros para esta fecha');
    } catch (error) {
      setMensaje('Error al buscar los registros');
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
      <Typography variant="h4" gutterBottom>Reportes de Ingreso</Typography>
      {mensaje && <Typography color="error">{mensaje}</Typography>}
      <TextField
        label="Fecha"
        type="date"
        InputLabelProps={{
          shrink: true,
        }}
        fullWidth
        margin="normal"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleBuscar}>
        Buscar
      </Button>
      <List>
        {registros.map((registro) => (
          <ListItem key={registro.id}>
            <ListItemText
              primary={`ID Documento: ${registro.idDocumento}`}
              secondary={`Bloque Horario: ${registro.bloqueHorario} | Fecha: ${new Date(
                registro.fecha.seconds * 1000
              ).toLocaleDateString()} ${new Date(
                registro.fecha.seconds * 1000
              ).toLocaleTimeString()}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Reportes;
