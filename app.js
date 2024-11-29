api.jsimport axios from 'axios';

// Configuración base de la API (puedes cambiar la URL por la de tu backend)
const api = axios.create({
  baseURL: 'http://localhost:5000/api/tareas', // URL del servidor
});

// Funciones CRUD para la API de tareas
export const obtenerTareas = async () => await api.get('/');
export const crearTarea = async (tarea) => await api.post('/', { nombre: tarea });
export const eliminarTarea = async (id) => await api.delete(`/${id}`);
export const actualizarTarea = async (id, tarea) => await api.put(`/${id}`, { nombre: tarea });

tareas.js import React, { useState, useEffect } from 'react';import { obtenerTareas, crearTarea, eliminarTarea, actualizarTarea } from '../services/api';
import './Tareas.css';

function Tareas() {
  const [tareas, setTareas] = useState([]);    // Estado para almacenar las tareas
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [modoEdicion, setModoEdicion] = useState(false);
  const [tareaActual, setTareaActual] = useState(null);

  // Función que carga las tareas al iniciar el componente
  const cargarTareas = async () => {
    try {
      const respuesta = await obtenerTareas(); // Llama a la API
      setTareas(respuesta.data);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
    }
  };

  // Cargar tareas al montar el componente
  useEffect(() => {
    cargarTareas();
  }, []);

  // Agregar una nueva tarea
  const manejarAgregarTarea = async () => {
    if (nuevaTarea.trim() === '') return; // Evita agregar tareas vacías
    try {
      await crearTarea(nuevaTarea);
      cargarTareas(); // Recargar la lista después de agregar
      setNuevaTarea('');
    } catch (error) {
      console.error('Error al agregar tarea:', error);
    }
  };

  // Eliminar una tarea
  const manejarEliminarTarea = async (id) => {
    try {
      await eliminarTarea(id);
      cargarTareas();
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
    }
  };

  // Activar modo de edición
  const activarEdicion = (tarea) => {
    setModoEdicion(true);
    setTareaActual(tarea);
    setNuevaTarea(tarea.nombre);
  };

  // Actualizar tarea
  const manejarActualizarTarea = async () => {
    if (nuevaTarea.trim() === '') return;
    try {
      await actualizarTarea(tareaActual._id, nuevaTarea);
      setModoEdicion(false);
      setNuevaTarea('');
      cargarTareas();
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
    }
  };

  return (
    <div className="contenedor-tareas">
      <h1>Lista de Tareas</h1>
      <div className="entrada-tarea">
        <input
          type="text"
          value={nuevaTarea}
          onChange={(e) => setNuevaTarea(e.target.value)}
          placeholder="Añadir nueva tarea"
        />
        {modoEdicion ? (
          <button onClick={manejarActualizarTarea}>Actualizar</button>
        ) : (
          <button onClick={manejarAgregarTarea}>Agregar</button>
        )}
      </div>
      <ul>
        {tareas.map((tarea) => (
          <li key={tarea._id}>
            {tarea.nombre}
            <div className="acciones">
              <button onClick={() => activarEdicion(tarea)}> </button>
              <button onClick={() => manejarEliminarTarea(tarea._id)}> </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Tareas;

tareas.css .contenedor-tareas {  width: 400px;
  margin: 50px auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #333;
}

.entrada-tarea {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

input[type="text"] {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
}

button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background-color: white;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  margin-bottom: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.acciones button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
}

EXPRESS npm init -ynpm install express cors
  MONGO_URI=mongodb://localhost:27017/tareasdbPORT=5000
models/Tarea.js 
const mongoose = require('mongoose');

const TareaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  completada: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Tarea', TareaSchema);

routes/tareaRoutes.js 
const express = require('express');
const router = express.Router();
const Tarea = require('../models/Tarea');

// Obtener todas las tareas
router.get('/', async (req, res) => {
  try {
    const tareas = await Tarea.find();
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener tareas' });
  }
});

// Crear una nueva tarea
router.post('/', async (req, res) => {
  try {
    const { nombre } = req.body;
    const nuevaTarea = new Tarea({ nombre });
    await nuevaTarea.save();
    res.status(201).json(nuevaTarea);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear la tarea' });
  }
});

// Actualizar una tarea
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    const tareaActualizada = await Tarea.findByIdAndUpdate(id, { nombre }, { new: true });
    res.json(tareaActualizada);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar la tarea' });
  }
});

// Eliminar una tarea
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Tarea.findByIdAndDelete(id);
    res.json({ mensaje: 'Tarea eliminada' });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al eliminar la tarea' });
  }
});

module.exports = router;

Server.js 
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const tareaRoutes = require('./routes/tareaRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/tareas', tareaRoutes);

// Conectar a la base de datos
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch((error) => console.error('Error de conexión:', error));

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
  
