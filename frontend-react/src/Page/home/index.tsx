import React, { useEffect, useState } from 'react'
import Layout from '../../Components/Layout'
import ListingCards from '../../Components/ListingCards'
import Navbar from '../../Components/Navbar'
import stays from "../../dummy/stays.json"
import SearchFilter from '../../Components/SearchFilter'
import Modal from '../../Components/Modal'
import Input from '../../Components/Input'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Rating } from '@smastrom/react-rating'
import { AiFillStar } from 'react-icons/ai'
import CurrencyInput from 'react-currency-input-field';
import Swal from 'sweetalert2'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import sowwy from '../../assets/Sorry.jpg'
import Loading from '../../Components/Loading'

interface FormValues {
  minprice: number;
  maxprice: number;
  daterange: Date[] | null[];
  minrating: number;
}

const initialFormValues: FormValues = {
  minprice: 0,
  maxprice: 0,
  daterange: [null, null],
  minrating: 0
};


const Home = () => {
  // Connect to api
  const [cookies, setCookie, removeCookie] = useCookies(['session']);
  const endpoint = `https://baggioshop.site/rooms`;
  const [rooms, setRooms] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const geoapiKey = "71097a12eab542b5b01173f273f24c96";
  const [dateStart, setDateStart] = useState('')
  const [dateEnd, setDateEnd] = useState('')

  // Form
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
  
  
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormValues(initialFormValues);
    if(formValues.daterange[0] && formValues.daterange[1]){
      setDateStart(formValues.daterange[0].toISOString().slice(0, 10).replace(/-/g, '-'))
      setDateEnd(formValues.daterange[0].toISOString().slice(0, 10).replace(/-/g, '-'))
    }
    fetchRoomData()
    setShowModal(false)
  }

  // Date Picker
  const [startDate, endDate] = formValues.daterange;

  // Rating
  const StarDrawing = (
    <path d="M11.0748 3.25583C11.4141 2.42845 12.5859 2.42845 12.9252 3.25583L14.6493 7.45955C14.793 7.80979 15.1221 8.04889 15.4995 8.07727L20.0303 8.41798C20.922 8.48504 21.2841 9.59942 20.6021 10.1778L17.1369 13.1166C16.8482 13.3614 16.7225 13.7483 16.8122 14.1161L17.8882 18.5304C18.1 19.3992 17.152 20.0879 16.3912 19.618L12.5255 17.2305C12.2034 17.0316 11.7966 17.0316 11.4745 17.2305L7.60881 19.618C6.84796 20.0879 5.90001 19.3992 6.1118 18.5304L7.18785 14.1161C7.2775 13.7483 7.1518 13.3614 6.86309 13.1166L3.3979 10.1778C2.71588 9.59942 3.07796 8.48504 3.96971 8.41798L8.50046 8.07727C8.87794 8.04889 9.20704 7.80979 9.35068 7.45955L11.0748 3.25583Z" ></path>
  );

  const customStyles = {
    itemShapes: StarDrawing,
    activeFillColor: '#fdd231',
    inactiveFillColor: '#0b3c95',

  };

  const filterEndpoint = `https://baggioshop.site/rooms/filter/data?`
  const filter = `rating=${formValues.minrating}&date_start=${dateStart}&date_end=${dateEnd}&price_min=${formValues.minprice}&price_max=${formValues.maxprice}`
  const fetchRoomData = async () => {
    try {
      const response = await axios.get(
        `${filterEndpoint}${filter}`,
        { headers: { Authorization: `Bearer ${cookies.session}` } }
      );
      console.log("room data: ", response.data.data);
      setRooms(response.data.data);
      if(response.data.data === null){
        Swal.fire({
          title: 'Room Is Not Avaible',
          text: 'Please Check Again!!!',
          imageUrl: `${sowwy}`,
          imageWidth: 400,
          imageHeight: 200,
          imageAlt: 'Custom image',
          confirmButtonText: "Yes",
          color: '#ffffff',
          background: '#1b44a6',
          confirmButtonColor: "#FDD231",
          }).then((willFetch)=>{
          if(willFetch.isConfirmed){
            axios.get(`${filterEndpoint}rating=&date_start=&date_end=&price_min=&price_max=`,{
              headers: { Authorization: `Bearer ${cookies.session}` }
            }).then((response)=>{
              setRooms(response.data.data);
            })
          }
        })
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(true);
    }
  };

  useEffect(() => {
    fetchRoomData();
  }, [filterEndpoint]);

  // Modal
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    setShowModal(true)
  }


  return (
    <Layout>
      <Navbar>
        <SearchFilter
          handleClick={()=> setShowModal(true)}
        />
      </Navbar>
      <div className='flex w-10/12'>
        <div className='max-w-screen-xl flex flex-col my-4 gap-4 w-full items-center sm:mt-10 sm:grid sm:grid-cols-2 sm:mx-auto lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
          { rooms && loading ? (
            rooms.map((room: any) => {
              return (
                <ListingCards
                  key={room.id}
                  id={room.id}
                  location={room.address}
                  rating={room.rating}
                  available={room.available}
                  price={room.price}
                  image={room.room_picture}
                />
              )
            })
          ) : (
              <Loading/>
          )}
        </div>
      </div>
      <Modal
        isOpen={showModal}
        isClose={() => setShowModal(false)}
        title="Filters"
        size='w-80 sm:w-96'
      >
        { loading === true ? (
          <form onSubmit={handleSubmit} className='flex flex-col font-light space-y-5'>
            <label htmlFor="minprice">Minimum Price</label>
            <CurrencyInput
              className='input input-primary bg-primary'
              id="minprice"
              name="minprice"
              prefix='Rp. '
              decimalSeparator=','
              groupSeparator='.'
              placeholder="Rp. "
              defaultValue={formValues.minprice}
              decimalsLimit={2}
              onValueChange={(value, name) => setFormValues({ ...formValues, minprice: value ? parseInt(value) : 0 })}
            />
            <label htmlFor="maxprice">Maximum Price</label>
            <CurrencyInput
              className='input input-primary bg-primary'
              id="maxprice"
              name="maxprice"
              prefix='Rp. '
              decimalSeparator=','
              groupSeparator='.'
              placeholder="Rp. "
              defaultValue={formValues.maxprice}
              decimalsLimit={2}
              onValueChange={(value, name) => setFormValues({ ...formValues, maxprice: value ? parseInt(value) : 0 })}
            />
            <label htmlFor="daterange">
              Date Range
            </label>
            <DatePicker
              className="input input-primary bg-primary w-full"
              name='daterange'
              placeholderText='Set reservation date'
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={
                (e: any) =>
                  setFormValues({ ...formValues, daterange: e })
              }
              // onChange={handleInputChange}
              dateFormat="d MMM yyyy"
              minDate={new Date()}
              isClearable={true}
              clearButtonClassName="btn btn-ghost"
            />
            <div>
              <div id="minrating">Minimum rating</div>
              <Rating
                itemStyles={customStyles}
                isRequired
                value={formValues.minrating}
                // visibleLabelId="minrating"
                onChange={(selectedValue: any) =>
                  setFormValues((prevData) => ({ ...prevData, minrating: selectedValue }))
                }
              />
            </div>
            <button className='btn btn-accent' type='submit' onClick={() => console.log(formValues)}>Submit</button>

          </form>

        ):(
          <Loading/>
        )}
      </Modal>
    </Layout>
  )
}

export default Home