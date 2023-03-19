import React, { useState, useEffect } from 'react'
import axios from "axios"
import Swal from 'sweetalert2'

import Layout from '../../Components/Layout'
import Navbar from '../../Components/Navbar'
import ListingCards from '../../Components/ListingCards'
import Button from '../../Components/Button'
import Modal from '../../Components/Modal'
import Input from '../../Components/Input'
import CurrencyInput from 'react-currency-input-field';
import TextArea from '../../Components/TextArea'

import { useCookies } from 'react-cookie'

import { FaCloudUploadAlt } from 'react-icons/fa';
import { useLocation } from 'react-router-dom'
import Loading from '../../Components/Loading'


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


const Listing = () => {

  const params = {
    access_key: '3c633bc54e0e5f7ea6b161ad1c4806cf',
    query: '1600 Pennsylvania Ave NW'
  }
  const [showEdit, setShowEdit] = useState(false)
  const [showBnb, setShowBnb] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [cookies, setCookie, removeCookie] = useCookies(['session']);
  const [loading, setLoading] = useState(false)
  const [rooms, setRooms] = useState([])
  const location = useLocation()
  const [lat, setLat] = useState(0)
  const [lon, setLon] = useState(0)
  const [formValues, setFormValues] = useState<ListingFormValues>(initialFormValues);
  const [selectedRoom, setSelectedRoom] = useState(0)
  const [room, setRoom] = useState<any>()
  const [file, setFile] = useState<File | any>(null)



  const endpoint = `https://baggioshop.site/users`

  const id = location.state.id

  const fetchRoomData = async () => {
    try {
      const response = await axios.get(
        `${endpoint}/${location?.state?.id}/rooms`,
        { headers: { Authorization: `Bearer ${cookies.session}` } }
      );
      console.log("room data: ", response.data.data);
      setRooms(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(true);
    }
  };

  useEffect(() => {
    fetchRoomData();

  }, [endpoint]);

  const roomEndpoint = `https://baggioshop.site/rooms`

  const handleDeleteRoom = (id: any) => {
    Swal.fire({
      title: `Are you sure delete this room?`,
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
        axios.delete(`https://baggioshop.site/rooms/${id}`, {
          headers: {
            Authorization: `Bearer ${cookies.session}`,
            Accept: 'application/json'
          }
        }).then((response) => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            iconColor: '#FDD231',
            padding: '1em',
            title: 'Successfuly Delete Room',
            color: '#ffffff',
            background: '#0B3C95 ',
            showConfirmButton: false,
            timer: 1200
          })
          fetchRoomData()
        })
      }
    })
  }



  const initialListingFormValues: ListingFormValues = {
    name: "",
    address: "",
    latitude: 0,
    longitude: 0,
    description: "",
    price: "",
  };

  const myKey = '71097a12eab542b5b01173f273f24c96'


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      setFile(files[0])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

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
            if (file === null || file) {
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
                  fetchRoomData()
                  setShowBnb(false)
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

  const handleEditRoom = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormValues(initialFormValues);
    setLoading(true);
    if (formValues.address === '') {
      if (file === null || file) {
        const formData = new FormData();
        formData.append('user_id', id);
        formData.append('room_picture', file);
        formData.append('room_name', formValues.name);
        formData.append('description', formValues.description);
        formData.append('price', formValues.price);
        axios.put(`${roomEndpoint}/${selectedRoom}`, formData,
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
            Swal.fire({
              position: 'center',
              icon: 'success',
              iconColor: '#FDD231',
              padding: '1em',
              title: 'Successfuly Edit Room',
              color: '#ffffff',
              background: '#0B3C95 ',
              showConfirmButton: false,
              timer: 1500
            })
            fetchRoomData()
            setShowEdit(false)
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
    } else {
      axios.get(`https://api.geoapify.com/v1/geocode/search?text=${formValues.address}&apiKey=${myKey}`)
        .then(response => {
          console.log("lat", response.data.features[0].properties.lat);
          console.log("lon", response.data.features[0].properties.lon);
          axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${response.data.features[0].properties.lat}&lon=${response.data.features[0].properties.lon}&apiKey=${myKey}`)
            .then(response => {
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
                axios.put(`${roomEndpoint}/${selectedRoom}`, formData,
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
                    Swal.fire({
                      position: 'center',
                      icon: 'success',
                      iconColor: '#FDD231',
                      padding: '1em',
                      title: 'Successfuly Edit Room',
                      color: '#ffffff',
                      background: '#0B3C95 ',
                      showConfirmButton: false,
                      timer: 1500
                    })
                    fetchRoomData()
                    setShowEdit(false)
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
    }
  }
  console.log(selectedRoom)
  return (
    <Layout>
      <Navbar
        children={<h1 className="font-bold text-2xl">Your Listings</h1>}
      />

      <div className='flex w-10/12'>
        <div className="max-w-screen-xl flex flex-col my-4 gap-4 w-full items-center sm:mt-10 sm:grid sm:grid-cols-2 sm:mx-auto lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'">
          {rooms && loading === true ? (
            rooms.map((item: any, index: any) => {
              return (
                <ListingCards
                  key={item.id}
                  id={item.id}
                  location={item.address}
                  rating={item.rating}
                  available={item.available}
                  name={item.room_name}
                  price={item.price}
                  image={item.room_picture}
                  handleEdit={() => { setShowEdit(true), setSelectedRoom(item.id) }}
                  toDelete={true}
                  handleDelete={() => handleDeleteRoom(item.id)}
                  edit={true}
                />
              )
            })
          ) : (
            <Loading/>
          )}
        </div>
      </div>



      <Button
        size='w-12 h-12 rounded-full fixed bottom-10 right-5 z-50 text-4xl'
        color='btn-accent'
        children='+'
        onClick={() => setShowBnb(true)}
      />

      <Modal
        title='Set Your bnb'
        isOpen={showBnb}
        size='w-full h-full sm:w-10/12 md:w-6/12 lg:w-5/12 sm:max-w-96 sm:h-4/6'
        isClose={() => setShowBnb(false)}
      >
        { loading === true ? ( 
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
        ):(
          <Loading/>
        )}

      </Modal>

      <Modal
        title='Edit Your bnb'
        isOpen={showEdit}
        size='w-full h-full sm:w-10/12 md:w-6/12 lg:w-5/12 sm:max-w-96 sm:h-4/6'
        isClose={() => setShowEdit(false)}
      > 
        {loading === true ? (
        <div className="flex justify-center">
          <form onSubmit={handleEditRoom}>
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
        ):(
            <Loading/>
        )}
      </Modal>

    </Layout>
  )
}

export default Listing