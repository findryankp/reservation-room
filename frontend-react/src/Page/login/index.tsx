import React, { useEffect, useState } from 'react'
import Layout from '../../Components/Layout'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../Components/Input'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import Swal from "sweetalert2";
import {MdAir} from "react-icons/md"

interface FormValues {
  email: string;
  password: string;
}

const initialFormValues: FormValues = {
  email: "",
  password: ""
};

const Login = () => {
  // Forms
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  // Login
  const [cookies, setCookie] = useCookies(['session', 'role']);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'https://baggioshop.site/login',
        {
          email: formValues.email,
          password: formValues.password
        }
      );
      const { data } = response.data;
      if (data) {
        Swal.fire({
          position: "center",
          icon: "success",
          text: "Signed successfully",
          iconColor: '#FDD231',
          showConfirmButton: false,
          color: '#ffffff',
          background: '#0B3C95 ',
          timer: 2000,
        });
        setCookie('role', data.role, { path: "/" });
        setCookie('session', response.data.token, { path: "/" });
        console.log(cookies.session)
        // dispatch(login(data));
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Email or Password incorrect",
        showConfirmButton: true,
        color: '#ffffff',
        background: '#0B3C95 ',
        confirmButtonColor: "#FDD231",
      });
      console.log(error);
    }
  }

  // Navigate to home page
  const navigate = useNavigate();

  useEffect(() => {
    if (cookies.session) {
      navigate("/home");
    }
  }, [cookies.session, navigate]);

  return (
    <Layout>

      <div className='md:bg-primary w-screen flex flex-col h-screen justify-between items-center'>

        <div className='mt-10'></div>

        <form className='bg-base-100 rounded-lg max-w-96 md:shadow-xl p-10 flex flex-col' onSubmit={handleSubmit}>
          <h1 className="text-center font-semibold text-4xl mb-4">Altabnb</h1>
          <Input
            type='email'
            label='Email'
            name='email'
            value={formValues.email}
            placeholder='enter your email'
            onChange={handleInputChange}
          />
          <Input
            type='password'
            label='Password'
            name='password'
            value={formValues.password}
            placeholder='enter your password'
            onChange={handleInputChange}
          />
          <button type='submit' className='self-center btn btn-accent w-full my-2'>Sign In</button>
          <h3 className='text-l text-center mt-2'>Not on AltaBnb yet? <Link to={"/register"} className='underline hover:text-accent'>Sign Up</Link> </h3>
        </form>



        <h2 className='text-xl text-accent font-semibold text-center mb-10'>Powered by Group2</h2>

      </div>
    </Layout>


  )
}

export default Login