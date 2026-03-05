import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Card } from 'primereact/card';
import { toast } from 'react-toastify';

export default function CreatePost() {
    const { token } = useContext(AuthContext); 
    const [titulo, setTitulo] = useState('');
    const [contenido, setContenido] = useState('');
    const [categoriaId, setCategoriaId] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5001/categorias')
            .then(res => res.json())
            .then(data => setCategorias(data))
            .catch(err => console.error("Error:", err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:5001/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ titulo, contenido, categoria_id: categoriaId })
            });

            if (response.ok) {
                toast.success("¡Post publicado!");
                navigate('/');
            } else {
                toast.error("Error al publicar.");
            }
        } catch (error) {
            toast.error("Error de conexión");
        }
    };

    return (
        <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
            <Card title="Nueva Publicación">
                <form onSubmit={handleSubmit} className="p-fluid">
                    <div className="field" style={{ marginBottom: '20px' }}>
                        <label>Título</label>
                        <InputText value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
                    </div>
                    <div className="field" style={{ marginBottom: '20px' }}>
                        <label>Categoría</label>
                        <Dropdown value={categoriaId} options={categorias} onChange={(e) => setCategoriaId(e.value)} optionLabel="nombre" optionValue="id" placeholder="Selecciona..." required />
                    </div>
                    <div className="field" style={{ marginBottom: '20px' }}>
                        <label>Contenido</label>
                        <InputTextarea value={contenido} onChange={(e) => setContenido(e.target.value)} rows={5} required />
                    </div>
                    <Button type="submit" label="Publicar" className="p-button-success" />
                    <Button type="button" label="Cancelar" className="p-button-text p-button-secondary" onClick={() => navigate('/')} />
                </form>
            </Card>
        </div>
    );
}