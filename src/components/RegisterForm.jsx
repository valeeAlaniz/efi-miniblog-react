import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import "../styles/RegisterForm.css" // Asegurate de que este archivo exista en tu carpeta

const validationSchema = Yup.object({
    // Cambiamos "name" por "username" para que coincida con Python
    username: Yup.string().required("El nombre es obligatorio"),
    email: Yup.string().email("Email invalido").required('El email es obligatorio'),
    password: Yup.string().required('La contraseña es obligatoria')
})

export default function RegisterForm() {
    const navigate = useNavigate()

    const handleSubmit = async (values, { resetForm }) => {
        try {
            // Corregimos el puerto al 5001
            const response = await fetch('http://localhost:5001/register', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values)
            })

            if (response.ok) {
                toast.success("Usuario registrado con exito")
                resetForm()
                // Lo mandamos al login para que entre con su nueva cuenta
                setTimeout(() => navigate('/login'), 2000)
            } else {
                const data = await response.json()
                toast.error(data.message || "Hubo un error al registrar el usuario")
            }
        } catch (error) {
            toast.error("Hubo un error con el servidor")
        }
    }

    return (
        <div className='register-container'>
            <h2>Crear cuenta</h2>
            <Formik
                // Cambiamos "name" por "username" en los valores iniciales
                initialValues={{ username: '', email: '', password: '', role: 'usuario' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className='register-form'>
                        <div className='form-field'>
                            <label>Nombre</label>
                            {/* Cambiamos el name del Field a "username" */}
                            <Field as={InputText} id='username' name='username' />
                            <ErrorMessage name='username' component='small' className='error' />
                        </div>
                        <div className='form-field'>
                            <label>Email</label>
                            <Field as={InputText} id='email' name='email' />
                            <ErrorMessage name='email' component='small' className='error' />
                        </div>
                        <div className='form-field'>
                            <label>Contraseña</label>
                            {/* Le agregamos type="password" para que salgan los puntitos */}
                            <Field type="password" as={InputText} id='password' name='password' />
                            <ErrorMessage name='password' component='small' className='error' />
                        </div>
                        
                        <Button type='submit' label={isSubmitting ? "Registrando..." : 'Registrarse'} className="p-button-raised p-button-success" />
                        
                        {/* Botoncito para volver atrás sin registrarse */}
                        <div style={{ marginTop: '15px', textAlign: 'center' }}>
                            <Button type="button" label="Volver al Login" className="p-button-text p-button-secondary" onClick={() => navigate('/login')} />
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}