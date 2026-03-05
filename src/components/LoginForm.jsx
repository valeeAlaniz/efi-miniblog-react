import React, { useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const validationSchema = Yup.object({
    email: Yup.string().email("Email inválido").required('El email es obligatorio'),
    password: Yup.string().required('La contraseña es obligatoria')
});

export default function LoginForm() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = async (values, { setSubmitting }) => {
        const success = await login(values.email, values.password);
        if (success) {
            navigate('/');
        }
        setSubmitting(false);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <div style={{ background: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', width: '400px' }}>
                <h2 style={{ textAlign: 'center', color: '#4338ca' }}>Iniciar Sesión</h2>
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className='p-fluid'>
                            <div className='field' style={{ marginBottom: '20px' }}>
                                <label htmlFor="email">Email</label>
                                <Field as={InputText} id='email' name='email' placeholder="tu@email.com" />
                                <ErrorMessage name='email' component='small' style={{ color: 'red', display: 'block', marginTop: '5px' }} />
                            </div>

                            <div className='field' style={{ marginBottom: '20px' }}>
                                <label htmlFor="password">Contraseña</label>
                                <Field type="password" as={InputText} id='password' name='password' placeholder="******" />
                                <ErrorMessage name='password' component='small' style={{ color: 'red', display: 'block', marginTop: '5px' }} />
                            </div>

                            <Button 
                                type='submit' 
                                label={isSubmitting ? "Ingresando..." : 'Ingresar'} 
                                className="p-button-raised p-button-primary"
                                disabled={isSubmitting}
                                style={{ width: '100%', marginTop: '10px' }}
                            />
                            
                            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                <p>¿No tienes cuenta? <Link to="/register" style={{ color: '#4338ca', fontWeight: 'bold' }}>Regístrate aquí</Link></p>
                                <Button type="button" label="Ir al Inicio como Invitado" className="p-button-text p-button-secondary" onClick={() => navigate('/')} />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}