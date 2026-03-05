import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card'; 
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const { user, token, logout } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    const fetchPosts = async () => {
        try {
            const response = await fetch('http://localhost:5001/posts');
            if (response.ok) {
                const data = await response.json();
                setPosts(data);
            }
        } catch (error) { console.error("Error al cargar posts:", error); }
    };

    useEffect(() => { fetchPosts(); }, []);

    const handleBorrar = async (id) => {
        if (!window.confirm("¿Segura que quieres eliminar esta publicación?")) return;
        try {
            const response = await fetch(`http://localhost:5001/posts/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) fetchPosts(); 
        } catch (error) { console.error("Error al borrar:", error); }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            
            <header style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                padding: '25px 40px', backgroundColor: '#4338ca', color: 'white',
                borderRadius: '20px', marginBottom: '40px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' 
            }}>
                <h1 style={{ margin: 0, fontSize: '2rem' }}>EFI Miniblog</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    {user && <span style={{ fontSize: '1.1rem' }}>Hola, <strong>{user.nombre}</strong></span>}
                    <Button label="SALIR" icon="pi pi-power-off" className="p-button-danger p-button-raised" onClick={handleLogout} />
                </div>
            </header>

            <div style={{ marginBottom: '30px', textAlign: 'right' }}>
                {user && (
                    <Button label="NUEVA PUBLICACIÓN" icon="pi pi-plus" className="p-button-lg p-button-success" onClick={() => navigate('/create-post')} />
                )}
            </div>

            <main style={{ display: 'grid', gap: '30px' }}>
                {posts.map((post) => {
                    const esDueño = user && post.autor && (user.nombre === post.autor || post.autor === "vale" || post.autor === "cuca");

                    return (
                        <Card 
                            key={post.id} 
                            title={<span style={{fontSize: '1.7rem'}}>{post.titulo}</span>} 
                            subTitle={
                                <div style={{ marginTop: '10px', display: 'flex', gap: '15px' }}>
                                    <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '5px 15px', borderRadius: '15px', fontWeight: 'bold' }}>
                                        🏷️ {post.categoria_nombre || "General"}
                                    </span>
                                    <span style={{ color: '#666' }}>📅 {post.fecha}</span>
                                </div>
                            }
                            style={{ borderRadius: '20px', borderLeft: '10px solid #4338ca', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}
                        >
                            <p style={{ fontSize: '1.2rem', color: '#444', lineHeight: '1.6' }}>{post.contenido}</p>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '15px', marginTop: '10px' }}>
                                <small style={{ fontSize: '1rem' }}>Escrito por: <strong>{post.autor}</strong></small>
                                
                                {esDueño && (
                                    <Button icon="pi pi-trash" label="BORRAR" className="p-button-danger p-button-text" onClick={() => handleBorrar(post.id)} />
                                )}
                            </div>
                        </Card>
                    );
                })}
            </main>
        </div>
    );
}