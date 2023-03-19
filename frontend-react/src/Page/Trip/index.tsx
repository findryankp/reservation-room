import React, { useEffect, useState } from 'react'
import Layout from '../../Components/Layout'
import Navbar from '../../Components/Navbar'
import FeedBackCard from '../../Components/FeedBackCard'
import stays from "../../dummy/stays.json"
import Modal from '../../Components/Modal'
import Button from '../../Components/Button'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useCookies } from 'react-cookie'


import { FaRegStar } from 'react-icons/fa'
import { Rating } from '@smastrom/react-rating'
import { FaStar } from 'react-icons/fa'
import TextArea from '../../Components/TextArea'
import Input from '../../Components/Input'
import Loading from '../../Components/Loading'

interface FormValues {
  comment: string;
  rating: number;
}

const initialFormValues: FormValues = {
  comment: '',
  rating: 0
};


const Trip = () => {

  const [showFeedback, setShowFeedback] = useState(false)
  const [showEditFeedback, setShowEditFeedback] = useState(false)
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
  const [cookies, setCookie, removeCookie] = useCookies(['session']);
  const [trip, setTrip] = useState([])
  const [loading, setLoading] = useState(false)
  const [id, setId] = useState(0)
  const [reservationId, setReservationId] = useState(0)
  const [feedbackId, setFeedbackId] = useState(0)
  const [feedback, setFeedback] = useState<any>({})
  const [rating, setRating] = useState(0)


  const endpoint = `https://baggioshop.site/reservations`

  const fetchTripData = async () => {
    try {
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${cookies.session}`
        }
      })
      console.log("trip data: ", response.data.data);
      setTrip(response.data.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(true)
    }
  }

  useEffect(() => {
    fetchTripData()
  }, [endpoint])

  const feedbackEndpoint = `https://baggioshop.site/feedbacks`


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
    console.log(setFormValues)
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormValues(initialFormValues);
    setLoading(false)
    axios.post(feedbackEndpoint, {
      reservation_id: reservationId,
      room_id: id,
      rating: formValues.rating,
      feedback: formValues.comment
    }, {
      headers: {
        Authorization: `Bearer ${cookies.session}`,
        "Content-Type": 'application/json'
      }
    })
      .then((response) => {
        console.log(response)
        Swal.fire({
          icon: 'success',
          iconColor: '#FDD231',
          padding: '1em',
          title: 'Successfuly Added Your FeedBack',
          color: '#ffffff',
          background: '#0B3C95 ',
          showConfirmButton: false,
          timer: 2000
        })
        fetchTripData()
        setShowFeedback(false)
      })
      .catch(error => { console.log(error) })
      .finally(() =>
        setLoading(true)
      )
  };

  const fetchFeedBackDetail = async () => {
    try {
      const response = await axios.get(`${feedbackEndpoint}/${feedbackId}`, {
        headers: {
          Authorization: `Bearer ${cookies.session}`
        }
      })
      console.log("feedback: ", response.data.data);
      setFeedback(response.data.data)
      setRating(response.data.rating)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(true)
    }
  }





  interface EditFormValues {
    comment: string;
    rating: number;
  }

  const initialEditFormValues: EditFormValues = {
    comment: '',
    rating: feedback.rating
  };

  const [editFormValues, setEditFormValues] = useState<EditFormValues>(initialEditFormValues);

  useEffect(() => {
    fetchFeedBackDetail()
    fetchTripData()

  }, [feedbackEndpoint, `${feedbackEndpoint}/${feedbackId}`])

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditFormValues({ ...editFormValues, [e.target.name]: e.target.value });
    console.log(setEditFormValues)
  };



  const handleEditFeedBack = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setEditFormValues(initialEditFormValues)
    setLoading(false)
    axios.put(`${feedbackEndpoint}/${feedbackId}`, {
      reservation_id: reservationId,
      room_id: id,
      rating: editFormValues.rating,
      feedback: editFormValues.comment
    }, {
      headers: {
        Authorization: `Bearer ${cookies.session}`,
        "Content-Type": 'application/json'
      }
    }).then((response) => {
      console.log(response)
      Swal.fire({
        icon: 'success',
        iconColor: '#FDD231',
        padding: '1em',
        title: 'Successfuly Edit Your FeedBack',
        color: '#ffffff',
        background: '#0B3C95 ',
        showConfirmButton: false,
        timer: 2000
      })
      fetchTripData()
      setShowEditFeedback(false)
    })
      .catch(error => { console.log(error) })
      .finally(() =>
        setLoading(true)
      )
  }

  const StarDrawing = (
    <path d="M11.0748 3.25583C11.4141 2.42845 12.5859 2.42845 12.9252 3.25583L14.6493 7.45955C14.793 7.80979 15.1221 8.04889 15.4995 8.07727L20.0303 8.41798C20.922 8.48504 21.2841 9.59942 20.6021 10.1778L17.1369 13.1166C16.8482 13.3614 16.7225 13.7483 16.8122 14.1161L17.8882 18.5304C18.1 19.3992 17.152 20.0879 16.3912 19.618L12.5255 17.2305C12.2034 17.0316 11.7966 17.0316 11.4745 17.2305L7.60881 19.618C6.84796 20.0879 5.90001 19.3992 6.1118 18.5304L7.18785 14.1161C7.2775 13.7483 7.1518 13.3614 6.86309 13.1166L3.3979 10.1778C2.71588 9.59942 3.07796 8.48504 3.96971 8.41798L8.50046 8.07727C8.87794 8.04889 9.20704 7.80979 9.35068 7.45955L11.0748 3.25583Z"></path>
  );

  const customStyles = {
    itemShapes: StarDrawing,
    activeFillColor: '#fdd231',
    inactiveFillColor: '#0b3c95',

  };

  return (
    <Layout>
      <Navbar />

      <div className='flex w-10/12'>
        <div className='max-w-screen-xl flex flex-col my-4 gap-4 w-full items-center sm:mt-10 sm:grid sm:grid-cols-2 sm:mx-auto lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
          {trip && loading ? (
            trip.map((item: any) => {
              return (
                <FeedBackCard
                  key={item.id}
                  id={item.id}
                  location={item.room.room_name}
                  dateStart={item.date_start}
                  dateEnd={item.date_end}
                  price={item.total_price}
                  value={item.feedback_rating}
                  duration={item.duration}
                  handleFeedback={() => { setShowFeedback(true), setId(item.room_id), setReservationId(item.id) }}
                  handleEdit={() => {
                    setShowEditFeedback(true),
                      setFeedbackId(item.feedback_id),
                      fetchFeedBackDetail(),
                      setEditFormValues((prevData) => ({ ...prevData, rating: item.feedback_rating })),
                      console.log(feedback.rating)
                  }}
                />
              )
            })
          ) : (
            <Loading/>
          )}
        </div>
      </div>



      <Modal
        isOpen={showFeedback}
        title='Review'
        size=''
        isClose={() => setShowFeedback(false)}
      >
        <div className="flex justify-center">
          <form className='flex flex-col w-60 sm:w-80' onSubmit={handleSubmit}>
            <Input
              label='Comment'
              name='comment'
              value={formValues.comment}
              onChange={handleInputChange}
              placeholder='Give Your Comment'
            />
            <Rating
              value={formValues.rating}
              itemStyles={customStyles}
              isRequired
              onChange={(selectedValue: any) =>
                setFormValues((prevData) => ({ ...prevData, rating: selectedValue }))
              }
            />
            <Button
              color="btn-accent"
              size='mt-5'
              children={"Save"}
              onClick={() => console.log(formValues)}
            />
          </form>

        </div>
      </Modal>
      <Modal
        isOpen={showEditFeedback}
        title='Review'
        size=''
        isClose={() => setShowEditFeedback(false)}
      >
        <div className="flex justify-center">
          <form className='flex flex-col w-60 sm:w-80' onSubmit={handleEditFeedBack}>
            <Input
              label='Comment'
              name='comment'
              value={editFormValues.comment}
              onChange={handleEditInputChange}
              placeholder={`${feedback.feedback}`}
            />
            <Rating
              value={editFormValues.rating}
              itemStyles={customStyles}
              onChange={(selectedValue: any) =>
                setEditFormValues((prevData) => ({ ...prevData, rating: selectedValue }))
              }
            />
            <Button
              color="btn-accent"
              size='mt-5'
              children={"Save"}
              onClick={() => {
                console.log(editFormValues)
                // setFormValues((prevData) => ({ ...prevData, rating: item.feedback_rating }))
              }}
            />
          </form>

        </div>
      </Modal>
    </Layout>
  )
}

export default Trip