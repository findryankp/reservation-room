import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCookies } from "react-cookie";
import axios from 'axios';
import Swal from 'sweetalert2';

// Component
import Layout from '../../Components/Layout'
import Navbar from '../../Components/Navbar'
import Button from '../../Components/Button'
import Modal from '../../Components/Modal'
import Input from '../../Components/Input';
import TextArea from '../../Components/TextArea';
import ListingModal, { ListingFormValues } from '../../Components/ListingModal';

//Icon
import { FaPenSquare } from 'react-icons/fa'
import { FaRoad } from 'react-icons/fa'
import { FaCloudUploadAlt } from 'react-icons/fa';
import { HiPencil } from 'react-icons/hi2';
import { GiJourney } from 'react-icons/gi'
import Loading from '../../Components/Loading';


interface FormValues {
    name: string;
    email: string;
    phone: string;
    address: string;
}

const initialFormValues: FormValues = {
    name: "",
    email: "",
    phone: "",
    address: "",
};



const ProfileHost = () => {

    const navigate = useNavigate()
    const location = useLocation()
    const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
    const [cookies, setCookie, removeCookie] = useCookies(['session', 'role'])
    const endpoint = `https://baggioshop.site/users`
    const [showBnb, setShowBnb] = useState(false)
    const [showDelete, setShowDelete] = useState(false)
    const [showEdit, setShowEdit] = useState(false)
    const [data, setData] = useState<any>({})
    const [loading, setLoading] = useState(false)
    const [id, setId] = useState()
    const Role = 'Host'
    const [lat, setLat] = useState(0)
    const [lon, setLon] = useState(0)
    const [file, setFile] = useState<File | any>(null)


    const fetchDataUser = async () => {
        try {
            const response = await axios.get(endpoint, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${cookies.session}`
                }
            });
            setData(response.data.data);
            setId(response.data.data.id)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(true);
        }
    };

    useEffect(() => {
        fetchDataUser();
    }, [endpoint]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    };

    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setFile(files[0]);
        };
    }

    const handleEditUser = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true);
        const formData = new FormData();
        formData.append("name", formValues.name);
        formData.append("email", formValues.email);
        formData.append("phone", formValues.phone);
        formData.append("address", formValues.address);
        formData.append("profile_picture", file);
        axios.put(endpoint, formData,
            {
                headers: {
                    Authorization: `Bearer ${cookies.session}`,
                    Accept: 'application/json',
                    "Content-Type": 'multipart/form-data'
                }
            })
            .then(result => {
                console.log("Form submitted with values: ", result)
                fetchDataUser();
                setShowEdit(false)
                Swal.fire({
                    // position: 'top-start',
                    icon: 'success',
                    iconColor: '#FDD231',
                    padding: '1em',
                    title: 'Successfuly Edit Account',
                    color: '#ffffff',
                    background: '#0B3C95 ',
                    showConfirmButton: false,
                    timer: 2000
                })
                
            })
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
    }

    const handleUpgradeUser = () => {
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
        }).then((willUpgrade) => {
            if (willUpgrade.isConfirmed) {
                axios.post(`${endpoint}/upgrade`, {
                    approvement: "yes",
                },
                    {
                        headers: {
                            Authorization: `Bearer ${cookies.session}`,
                            Accept: 'application/json',
                            "Content-Type": 'application/json'
                        }
                    })
                    .then((response) => {
                        console.log(response.data.data.role)
                        setCookie('role', response.data.data.role, { path: "/" });
                        Swal.fire({
                            // position: 'top-start',
                            icon: 'success',
                            iconColor: '#FDD231',
                            padding: '1em',
                            title: "You're Host Now",
                            color: '#ffffff',
                            background: '#0B3C95 ',
                            showConfirmButton: false,
                            timer: 2000
                        })
                        fetchDataUser()
                    })
                    .catch((error) => { console.log(error) })
                    .finally(() => setLoading(false))
            }
        })
    }

    const handleDeleteUser = () => {
        Swal.fire({
            title: `Are you sure delete account ${data.name}?`,
            text: "You will not be able to recover your data!",
            icon: "warning",
            iconColor: '#FDD231',
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            color: '#ffffff',
            background: '#0B3C95 ',
            confirmButtonColor: "#FDD231",
            cancelButtonColor: "#FE4135",
        }).then((willDelete) => {
            if (willDelete.isConfirmed) {
                axios.delete(endpoint, {
                    headers: {
                        Authorization: `Bearer ${cookies.session}`,
                        Accept: 'application/json'
                    }
                }).then((response) => {
                    Swal.fire({
                        // position: 'top-start',
                        icon: 'success',
                        iconColor: '#FDD231',
                        padding: '1em',
                        title: 'Successfuly Delete Account',
                        color: '#ffffff',
                        background: '#0B3C95 ',
                        showConfirmButton: false,
                        timer: 2000
                    })
                    removeCookie('session');
                    removeCookie('role');
                    navigate("/");
                })
            }
        })
    }

    return (
        <Layout>
            <Navbar 
            imgUser={data.profile_picture}
            />
            <div className='md:bg-primary w-screen flex flex-col h-screen justify-between items-center'>
                <div className="text-white mt-10 w-9/12 flex flex-col sm:justify-center">
                    <h1 className='text-4xl w-60 sm:w-full font-bold sm:text-center'>Personal Information</h1>
                    <div className="grid grid-cols-2 sm:grid-cols-1 sm:justify-items-center">
                    {data && loading === true ? (
                        <div className="flex flex-col mt-10 space-y-3 w-60 sm:w-96">
                            <div className='border-b-2 border-primary md:border-base-100'>
                                <label htmlFor="name" className='text-l font-semibold'>
                                    Name
                                </label>
                                <p className='text-slate-300 text-l'>{data.name}</p>
                            </div>
                            <div className='border-b-2 border-primary md:border-base-100'>
                                <label htmlFor="email" className='text-l font-semibold'>
                                    Email
                                </label>
                                <p className='text-slate-300 text-l italic'>{data.email}</p>
                            </div>
                            <div className='border-b-2 border-primary md:border-base-100'>
                                <label htmlFor="phone_number" className='text-l font-semibold'>
                                    Phone Number
                                </label>
                                <p className='text-slate-300 text-l'>{data.phone}</p>
                            </div>
                            <div className='border-b-2 border-primary md:border-base-100'>
                                <label htmlFor="address" className='text-l font-semibold'>
                                    Address
                                </label>
                                <p className='text-slate-300 text-l'>
                                    {data.address}
                                </p>
                            </div>
                            <div className='space-y-3'>
                                <p className='text-sm font-semibold underline italic flex hover:cursor-pointer hover:text-accent' onClick={() => setShowEdit(true)}>
                                    <HiPencil className='mr-1 text-xl' />Edit Your Profile
                                </p>
                                <p className='text-sm font-semibold underline italic flex hover:cursor-pointer hover:text-accent' onClick={() => navigate('/trip')}>
                                    <GiJourney className='text-xl mr-1'/>See Your Trips
                                </p>
                            </div>
                        </div>
                    ):(
                        <Loading/>
                    )}
                        <div className="flex w-20 ml-10 space-x-2 mt-8 sm:ml-4 sm:hidden">
                            <Button
                                color='btn-accent'
                                size='btn-sm text-xl'
                                children={<FaPenSquare />}
                                onClick={() => setShowEdit(true)}
                            />
                            <Button
                                color='btn-white'
                                size='btn-sm text-xl'
                                children={<FaRoad />}
                                onClick={() => navigate('/trip')}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col mt-10 space-y-3 sm:items-center md:ml-10">
                        <div className='grid sm:grid-cols-2 gap-4'>
                            <Button
                                color='btn-accent sm:btn-accent sm:text-primary sm:text-xs'
                                size={`sm:w-60 sm:btn-sm  ${cookies.role === Role ? 'static' : 'hidden'}`}
                                children={'View your listed Bnbs'}
                                onClick={() => navigate(`/list_bnb/${data.id}`, {
                                    state: {
                                        id: data.id
                                    }
                                }
                                )}
                            />
                            <Button
                                color='btn-accent'
                                size='sm:w-60 sm:btn-sm sm:text-xs'
                                children={cookies.role === Role ? 'Create A New BnB' : 'Make your home Bnb ?'}
                                onClick={cookies.role === Role ? () => setShowBnb(true) : handleUpgradeUser}
                            />
                        </div>
                    </div>
                    <div className="flex w-5/6 mt-20 mb-10 sm:justify-center">
                        <Button
                            color='btn-warning sm:btn-sm sm:text-xs'
                            children={'Delete Account'}
                            onClick={handleDeleteUser}
                        />
                    </div>
                </div>
            </div>
            <Modal
                title='Set your BnB'
                isOpen={showBnb}
                size='w-full h-full sm:w-10/12 md:w-6/12 lg:w-5/12 sm:max-w-96 sm:h-4/6'
                isClose={() => setShowBnb(false)}
            >
                {loading === true ?(
                    <ListingModal
                        id={data.id}
                    />
                ):(
                    <Loading/>
                )}
            </Modal>
            <Modal
                isOpen={showEdit}
                size='w-full h-full sm:w-10/12 md:w-6/12 lg:w-5/12 sm:max-w-96 sm:h-4/6'
                isClose={() => setShowEdit(false)}
            > 
                {loading === true ?(

                <div className="text-white items-center w-full flex flex-col justify-center sm:mx-auto">
                    <h1 className='text-4xl font-bold mb-4'>Edit Your Profile</h1>
                    <form onSubmit={handleEditUser}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* <div className="flex flex-col mt-10 space-y-3 "> */}
                            <div>
                                <Input
                                    type='text'
                                    label='Name'
                                    name='name'
                                    placeholder={`${data.name}`}
                                    value={formValues.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <Input
                                    type='email'
                                    label='Email'
                                    name='email'
                                    placeholder={`${data.email}`}
                                    value={formValues.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <Input
                                    type='number'
                                    label='Phone Number'
                                    name='phone'
                                    placeholder={`${data.phone}`}
                                    value={formValues.phone}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className='row-span-2'>
                                <TextArea
                                    label='Address'
                                    name='address'
                                    placeholder={`${data.address}`}
                                    value={formValues.address}
                                    onChange={handleTextAreaChange}
                                />
                            </div>
                            <div>
                                <Input
                                    type='file'
                                    label='Your Room Photo'
                                    name='file'
                                    classes='file-input file-input-primary'
                                    placeholder='set room name'
                                    onChange={handleFileInputChange}
                                />
                            </div>
                            {/* </div> */}
                        </div>
                        <div className="flex justify-end">
                            <Button
                                type='submit'
                                color="btn-accent"
                                size='mt-5'
                                children={"Save"}
                            />
                        </div>
                    </form>
                </div>
                ):(
                <Loading/>
                )}
            </Modal>
        </Layout>
    )
}

export default ProfileHost