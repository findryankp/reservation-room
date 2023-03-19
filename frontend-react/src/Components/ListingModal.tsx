import React, { useEffect, useState } from 'react'
import CurrencyInput from 'react-currency-input-field';
import Input from './Input'
import TextArea from './TextArea'
import axios from 'axios';
import Swal from 'sweetalert2';
import { useCookies } from "react-cookie";
import { useNavigate, useLocation } from 'react-router-dom'
import { FaCloudUploadAlt } from 'react-icons/fa';

export interface ListingFormValues {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    description: string;
    price: string | any;
};

const initialFormValues: ListingFormValues = {
    name: '',
    address: '',
    latitude: 0,
    longitude: 0,
    description: '',
    price: 0
}

interface ListingProps {
    id: number | any
}

const ListingModal: React.FC<ListingProps> = ({ id }) => {

    const [cookies, setCookie, removeCookie] = useCookies(['session', 'role'])
    const [loading, setLoading] = useState(false)
    const [formValues, setFormValues] = useState<ListingFormValues>(initialFormValues);
    const navigate = useNavigate()
    const [file, setFile] = useState<File | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files) {
            setFile(files[0])
            // const images = Array.from(files).filter((file)=>
            // file.type.startsWith('image/')
            // )
            // setFile((prevImages:any)=>[...prevImages, ...images])
        }
    }




    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    };

    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    };



    const myKey = '71097a12eab542b5b01173f273f24c96'

    const roomEndpoint = `https://baggioshop.site/rooms`


    const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        setFormValues(initialFormValues);
        setLoading(true);
        axios.get(`https://api.geoapify.com/v1/geocode/search?text=${formValues.address}&apiKey=${myKey}`)
            .then(response => {
                console.log("lat", response.data.features[0].properties.lat);
                console.log("lon", response.data.features[0].properties.lon);
                axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${response.data.features[0].properties.lat}&lon=${response.data.features[0].properties.lon}&apiKey=${myKey}`)
                    .then(response => {
                        // let imageFile = document.querySelector('#file')
                        if (file) {
                            const formData = new FormData();
                            formData.append('user_id', id);
                            formData.append('room_picture', file);
                            formData.append('room_name', formValues.name);
                            formData.append('address', response.data.features[0].properties.city);
                            formData.append('description', formValues.description);
                            formData.append('price', formValues.price);
                            formData.append('latitude', response.data.features[0].properties.lat);
                            formData.append('longitude', response.data.features[0].properties.lon);
                            axios.post(roomEndpoint, formData,
                                {
                                    headers: {
                                        Authorization: `Bearer ${cookies.session}`,
                                        Accept: 'application/json',
                                        "Content-Type": 'multipart/form-data'
                                    }
                                }
                            )
                                .then(result => {
                                    console.log("Form submitted with values: ", result)
                                    navigate(`/list_bnb/${id}`, {
                                        state: {
                                            id: id
                                        }
                                    })
                                    Swal.fire({
                                        position: 'center',
                                        icon: 'success',
                                        iconColor: '#FDD231',
                                        padding: '1em',
                                        title: 'Successfuly Add Room',
                                        color: '#ffffff',
                                        background: '#0B3C95 ',
                                        showConfirmButton: false,
                                        timer: 1500
                                    })
                                })
                                .catch((error) => {
                                    Swal.fire({
                                        title: "Failed",
                                        icon: "error",
                                        iconColor: '#FDD231',
                                        showCancelButton: true,
                                        confirmButtonText: "Yes",
                                        cancelButtonText: "No",
                                        color: '#ffffff',
                                        background: '#0B3C95 ',
                                        confirmButtonColor: "#FDD231",
                                        cancelButtonColor: "#FE4135",
                                    })
                                    console.log(error)
                                })
                                .finally(() => setLoading(false));
                        }
                    }).catch(error => {
                        console.log(error);
                    });
            }).catch(error => {
                console.log(error);
            })
    };


    return (
        <div className="flex justify-center">
            <form onSubmit={handleSubmit}>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <Input
                        type='text'
                        label='Name'
                        name='name'
                        placeholder='set room name'
                        value={formValues.name}
                        onChange={handleInputChange}
                    />
                    <div>
                        <label className='mb-2 font-light block' htmlFor="price">Price/night</label>
                        <CurrencyInput
                            className='input input-primary bg-primary w-full'
                            id="price"
                            name="price"
                            prefix='Rp. '
                            decimalSeparator=','
                            groupSeparator='.'
                            placeholder="Rp. "
                            value={formValues.price}
                            decimalsLimit={2}
                            onValueChange={(value, name) => setFormValues({ ...formValues, price: value ? parseInt(value) : 0 })}
                        />
                    </div>
                    <TextArea
                        label='Address'
                        name='address'
                        placeholder='enter home address'
                        value={formValues.address}
                        onChange={handleTextAreaChange}
                    />
                    <TextArea
                        label='Description'
                        name='description'
                        placeholder='enter your home descrption'
                        value={formValues.description}
                        onChange={handleTextAreaChange}
                    />


                    <Input
                        type='file'
                        label='Your Room Photo'
                        name='file'
                        classes='file-input file-input-primary'
                        placeholder='set room name'
                        onChange={handleFileChange}
                    />

                    <button type='submit' className='self-end mb-1 btn btn-accent'>Save</button>
                </div>


            </form>
        </div>
    )
}

export default ListingModal