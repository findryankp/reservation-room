import React, { useEffect } from 'react'
import { FaChevronCircleLeft } from "react-icons/fa"
import { HiCog6Tooth } from 'react-icons/hi2'
import { FaSignOutAlt } from 'react-icons/fa'
import { GiJourney } from 'react-icons/gi'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useCookies } from 'react-cookie'

import axios from 'axios'

interface NavbarProps {
    name?: string
    handleProfile?: React.MouseEventHandler;
    children?: React.ReactNode
    imgUser?: string
}

const Navbar: React.FC<NavbarProps> = ({ name, handleProfile, children, imgUser }) => {


    // handle log out
    const [cookies, setCookie, removeCookie] = useCookies(['session', 'role']);
    const navigate = useNavigate()



    const handleLogout = () => {
        Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            color: '#ffffff',
            background: '#0B3C95 ',
            confirmButtonColor: "#FDD231",
            cancelButtonColor: "#FE4135",
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    text: "Logout successfully",
                    iconColor: '#FDD231',
                    color: '#ffffff',
                    background: '#0B3C95 ',
                    showConfirmButton: false,
                    timer: 1500,
                })
                removeCookie('session');
                removeCookie('role');
                navigate("/");
            }
        });
    }


    //Handle Profile Picture
    const [loading, setLoading] = React.useState(true)
    const [img, setImg] = React.useState<any>()
    const endpoint = `https://baggioshop.site/users`

    const fetchDataUser = async () => {
        try {
            const response = await axios.get(endpoint, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${cookies.session}`
                }
            });
            setImg(response.data.data.profile_picture)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDataUser();
    }, [endpoint]);

    return (
        <div className="navbar w-screen bg-base-100 shadow-md z-10 top-0 sticky text-white border-b-2 border-primary justify-center">
            <div className='flex gap-4 flex-between justify-center w-10/12 max-w-screen-lg'>
                <div>
                    <button onClick={() => navigate(-1)} className="md:hidden text-4xl text-white hover:text-accent">
                        <FaChevronCircleLeft />
                    </button >

                    <button onClick={() => navigate("/home")} className="font-semibold hidden md:flex text-4xl text-white hover:text-accent">
                        <h1>AltaBnB</h1>
                    </button >

                </div>
                <div className="flex w-full justify-center">
                    {children}
                </div>

                <div className="flex-none">
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="">
                            <img src={imgUser ? imgUser : img} className='rounded-full w-10 h-10 hover:border-2 hover:border-accent hover:cursor-pointer' alt="" />
                        </label>
                        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-primary rounded-box w-52">
                            <li onClick={() => navigate('/profile_host')}><a>
                                <HiCog6Tooth />
                                Profile
                            </a>
                            </li>
                            <li onClick={() => navigate('/trip')}><a>
                                <GiJourney />
                                Trips
                            </a>
                            </li>
                            <li onClick={handleLogout}><a>
                                <FaSignOutAlt />
                                Sign Out
                            </a>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Navbar

function removeCookie(arg0: string) {
    throw new Error('Function not implemented.')
}
