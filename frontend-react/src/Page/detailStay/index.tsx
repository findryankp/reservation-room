import React, { useEffect, useState } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { useParams } from 'react-router';
import Layout from '../../Components/Layout';
import Navbar from '../../Components/Navbar';
import stays from "../../dummy/stays.json"
import Modal from '../../Components/Modal';
import Button from '../../Components/Button';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Rating } from '@smastrom/react-rating';
import { FaChevronCircleLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { formatValue } from 'react-currency-input-field';
import CommentCard from '../../Components/CommentCard';
import Loading from '../../Components/Loading';

const DetailStay = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['session']);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState(0)

  // Get stay ID from url
  const { stayId } = useParams();
  const [stay, setStay] = useState(stays.find(({ id }) => id === parseInt(stayId || "")));
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false)


  // API
  const endpoint = "https://baggioshop.site"
  const fetchDetails = async () => {
    await axios
      .get(`${endpoint}/rooms/${stayId}`, {
        headers: { Authorization: `Bearer ${cookies.session}` },
      })
      .then((res) => {
        setLoading(true)
        setStay(res.data.data);
      })
      .catch((err) => console.log(err));
  };

  const fetchComments = async () => {
    await axios
      .get(`${endpoint}/rooms/${stayId}/feedbacks`, {
        headers: { Authorization: `Bearer ${cookies.session}` },
      })
      .then((res) => {
        setComments(res.data.data);
        setLoading(true)
      })
      .catch((err) => console.log(err));
  };

  const daysBetween = (startDate: Date, endDate: Date) => {
    const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
    return (Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1);
  }

  const fetchReservations = async () => {
    try {
      const response = await axios.get(`${endpoint}/rooms/${stayId}/reservations`, {
        headers: { Authorization: `Bearer ${cookies.session}` },
      });
      const reservations = response.data.data;
      setReservations(reservations);
      console.log(reservations)

      if (reservations) {
        const dates = reservations.flatMap((reservation: any) => {
          const startDate = new Date(reservation.date_start);
          const endDate = new Date(reservation.date_end);

          // Get the number of days between start and end dates
          // const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
          // const numDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

          const numDays = daysBetween(startDate, endDate);

          // Generate an array of dates from start to end
          return Array.from({ length: numDays }, (_, i) => {
            const date = new Date(startDate.getTime() + i * (1000 * 3600 * 24));
            return new Date(date.getFullYear(), date.getMonth(), date.getDate());
          });
        });
        setReservedDates(dates);
        console.log("Reserved dates: ", dates);
      }

    } catch (error) {
      console.error(error);
    }
  };

  // Rating
  const StarDrawing = (
    <path d="M11.0748 3.25583C11.4141 2.42845 12.5859 2.42845 12.9252 3.25583L14.6493 7.45955C14.793 7.80979 15.1221 8.04889 15.4995 8.07727L20.0303 8.41798C20.922 8.48504 21.2841 9.59942 20.6021 10.1778L17.1369 13.1166C16.8482 13.3614 16.7225 13.7483 16.8122 14.1161L17.8882 18.5304C18.1 19.3992 17.152 20.0879 16.3912 19.618L12.5255 17.2305C12.2034 17.0316 11.7966 17.0316 11.4745 17.2305L7.60881 19.618C6.84796 20.0879 5.90001 19.3992 6.1118 18.5304L7.18785 14.1161C7.2775 13.7483 7.1518 13.3614 6.86309 13.1166L3.3979 10.1778C2.71588 9.59942 3.07796 8.48504 3.96971 8.41798L8.50046 8.07727C8.87794 8.04889 9.20704 7.80979 9.35068 7.45955L11.0748 3.25583Z" stroke="#fdd231" stroke-width="1" ></path>
  );

  const customStyles = {
    itemShapes: StarDrawing,
    activeFillColor: '#fdd231',
    inactiveFillColor: '#0b3c95',

  };

  // Date Picker
  const [reservations, setReservations] = useState<any>([]);
  const [reservedDates, setReservedDates] = useState<Date[]>()
  const [dateRange, setDateRange] = useState<any>([null, null]);
  const [startDate, endDate] = dateRange;

  // Disable Date Range
  const getDatesInRange = (startDateStr: string, endDateStr: string): Date[] => {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    const dates = [];

    for (let currentDate = startDate; currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
      dates.push(new Date(currentDate));
    }

    return dates;
  };


  // Check if two arrays are unique
  const uniqueArrays = (arr1: any[], arr2: any[]): boolean =>
    !arr1.some(obj1 => arr2.some(obj2 => JSON.stringify(obj1) === JSON.stringify(obj2)));

  // Change date format to string
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Handle invalid date
  const [dateWarning, setDateWarning] = useState(false);

  const handleWarning = () => {
    setDateWarning(true);
  };

  // Handle reserve
  const handleReserve = () => {
    axios.post(
      `https://baggioshop.site/reservations`,
      {
        room_id: stay?.id,
        date_start: dateRange[0].toISOString().slice(0, 10).replace(/-/g, '-'),
        date_end: dateRange[1].toISOString().slice(0, 10).replace(/-/g, '-'),
        total_price: totalPrice
      },
      { headers: { Authorization: `Bearer ${cookies.session}`, "Content-Type": "application/json" } })
      .then(result => {
        console.log(result);
        window.open(result.data.data.payment_link);
        navigate("/trip")
      })
      .catch(error => console.log(error))

  }

  // Use Effect
  useEffect(() => {
    fetchDetails();
    fetchComments();
    fetchReservations();

    if (dateWarning) {
      const timeoutId = setTimeout(() => {
        setDateWarning(false);
      }, 2000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [dateWarning, endpoint]);

  return (
    <Layout>

      <Modal
        isOpen={showModal}
        isClose={() => setShowModal(false)}
        title="Room Description"
        size='w-full h-full sm:w-10/12 sm:h-5/6'
      >
        <p className='font-light'>
          {stay?.description}
        </p>
      </Modal>
      <div className='hidden md:flex'>
        <Navbar>

        </Navbar>
      </div>
      {stay && loading === true ?(

      <div className='flex flex-col justify-center w-screen md:w-10/12 max-w-screen-lg'>
        <h1 className='hidden text-accent md:flex text-4xl font-bold my-4'>{stay?.room_name}</h1>
        <div className='grid gap-4 grid-cols-3'>

          <div className='col-span-3 md:col-span-2 w-full justify-self-center'>
            <div className='fixed top-3 flex w-full justify-center'>
              <button onClick={() => navigate(-1)} className="flex w-10/12 md:hidden ml-1 text-4xl text-white hover:text-accent">
                <FaChevronCircleLeft />
              </button>
            </div>

            <img
              className='md:rounded-lg md:shadow-lg object-cover w-full h-60 md:h-96'
              src={stay?.room_picture}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = "https://www.nj.com/resizer/QgEkPOPu3r2bkqGAf7DjtCH7sJM=/1280x0/smart/cloudfront-us-east-1.images.arcpublishing.com/advancelocal/HK5EHPHYX5CR7BS2E5TGVHZBGE.JPG";
              }}
            />

          </div>

          <div className='col-span-1 shadow-lg bg-primary rounded-lg hidden md:flex gap-2 flex-col items-center justify-between py-4 px-4'>
            <div className='w-full flex flex-col gap-2'>
              <h2 className='self-center font-semibold text-2xl mb-4 text-accent'>Reserve Now</h2>
              <h2 className="flex w-full justify-between items-center">
                <p className='font-semibold'>{stay?.address}</p>
                <div className="badge badge-accent"><AiFillStar />{stay?.rating}</div>
              </h2>

              <DatePicker
                className="input input-ghost bg-base-100 w-full"
                placeholderText='Set reservation date'
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update: any) => {
                  setDateRange(update);

                  if (update[1] != null) {
                    // const chosenDates = update.map((date: Date) => date.toISOString().substring(0, 10));
                    const chosenDates = getDatesInRange(update[0], update[1])
                    console.log("chosen: ", chosenDates)
                    console.log("reserved: ", reservedDates)
                    if (stay?.price && (reservedDates === undefined || (chosenDates && reservedDates && uniqueArrays(chosenDates, reservedDates)))) {
                      console.log("true")
                      setDateRange(update);
                      setTotalPrice(stay?.price * (daysBetween(update[0], update[1]) - 1))

                    } else {
                      handleWarning();
                      console.log("false");
                      setDateRange([null, null]);
                    }
                  }

                }}
                dateFormat="d MMM yyyy"
                minDate={new Date()}
                excludeDates={reservedDates}
                isClearable={true}
                clearButtonClassName="btn btn-ghost"
              />
            </div>

            <div className='flex flex-col w-full'>
              <div
                className={`${dateWarning
                  ? 'opacity-100 transition-opacity duration-500'
                  : 'opacity-0 hidden transition-opacity duration-500'
                  } alert alert-warning shadow-lg w-full`}
              >
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <span>Invalid Date</span>
                </div>
              </div>

              <div className={`${dateWarning
                ? 'opacity-0 transition-opacity duration-500 hidden'
                : 'opacity-100 transition-opacity duration-500'
                } flex flex-col items-start gap-2 mt-20 w-full h-full`}>

                <div>
                  <p>{formatValue({
                    value: JSON.stringify(stay?.price),
                    groupSeparator: '.',
                    decimalSeparator: ',',
                    prefix: 'Rp. ',
                  })}
                    {dateRange[0] !== null && dateRange[1] !== null ?
                      ` x  ${daysBetween(dateRange[0], dateRange[1]) - 1} nights` :
                      " /night"}
                  </p>
                  {dateRange[1] !== null ?
                    <>
                      <p className='font-semibold'>
                        {"Total: "}
                        {formatValue({
                          value: JSON.stringify(totalPrice),
                          groupSeparator: '.',
                          decimalSeparator: ',',
                          prefix: 'Rp. ',
                        })}
                      </p>
                    </> :
                    <></>
                  }
                </div>

                {dateRange[1] !== null ?
                  <button onClick={handleReserve} className='btn w-full btn-accent'>Reserve</button> :
                  <button disabled className='btn w-full btn-accent'>Reserve</button>
                }
              </div>
            </div>

          </div>
        </div>

      </div>
      ):(
        <Loading/>
      )}


      <div className='flex flex-col w-10/12 max-w-screen-lg gap-2 mt-2 mb-40 md:mb-2'>
        <div>
          <h1 className='md:hidden text-2xl font-semibold'>{stay?.room_name}</h1>
          <h2 className="md:hidden flex justify-begin gap-2 items-center">
            <div className="badge badge-accent"><AiFillStar />{stay?.rating}</div>
            <p className='font-semibold'>{stay?.address}</p>
          </h2>
          <h2 className='font-semibold text-accent mt-4'>About this room</h2>
          <p className='font-light line-clamp-5 md:line-clamp-10'>
            {stay?.description}
          </p>
          <button
            className='self-start font-semibold underline hover:text-accent mb-4'
            onClick={() => setShowModal(true)}
          >
            Show More
          </button>

          {comments.length == 0 ? <></> : <h2 className='font-semibold text-accent mt-4'>Reviews</h2>}


          <div className='flex flex-col gap-2'>
          {comments && loading === true ?(
            comments.map((comment: any) => {
              return (
                <CommentCard
                  key={comment.id}
                  id={comment.id}
                  user={comment.user_name}
                  image={comment.user_profile_picture}
                  date="2023-10-10"
                  rating={comment.rating}
                  comment={comment.feedback}
                />
              )
            })
          ):(
              <Loading/>
          )}
            {/* <CommentCard
              id={2}
              user="Mus"
              image="https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg"
              date="2023-10-10"
              rating={4}
              comment="Tempatnya lumayan oke sih ini"
            /> */}
          </div>



        </div>
      </div>

      <div className='md:hidden h-30 flex fixed justify-center gap-2 bottom-0 w-screen border-t-4 border-primary bg-base-100'>
        <div className='flex flex-col w-10/12 max-w-screen-lg gap-2 my-4'>
          <DatePicker
            className="input input-primary bg-primary w-full"
            placeholderText='Set reservation date'
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update: any) => {
              setDateRange(update);

              if (update[1] != null) {
                // const chosenDates = update.map((date: Date) => date.toISOString().substring(0, 10));
                const chosenDates = getDatesInRange(update[0], update[1])
                console.log("chosen: ", chosenDates)
                console.log("reserved: ", reservedDates)
                if (stay?.price && (reservedDates === undefined || (chosenDates && reservedDates && uniqueArrays(chosenDates, reservedDates)))) {
                  console.log("true")
                  setDateRange(update);
                  setTotalPrice(stay?.price * (daysBetween(update[0], update[1]) - 1))

                } else {
                  handleWarning();
                  console.log("false");
                  setDateRange([null, null]);
                }
              }

            }}
            dateFormat="d MMM yyyy"
            minDate={new Date()}
            excludeDates={reservedDates}
            isClearable={true}
            clearButtonClassName="btn btn-ghost"
          />


          <div className='flex justify-center'>
            <div
              className={`${dateWarning
                ? 'opacity-100 transition-opacity duration-500'
                : 'opacity-0 hidden transition-opacity duration-500'
                } alert alert-warning shadow-lg w-full`}
            >
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <span>Invalid Date</span>
              </div>
            </div>

            <div className={`${dateWarning
              ? 'opacity-0 transition-opacity duration-500 hidden'
              : 'opacity-100 transition-opacity duration-500'
              } flex items-center justify-between w-full`}>

              <div>
                <p>{formatValue({
                  value: JSON.stringify(stay?.price),
                  groupSeparator: '.',
                  decimalSeparator: ',',
                  prefix: 'Rp. ',
                })}
                  {dateRange[0] !== null && dateRange[1] !== null ?
                    ` x  ${daysBetween(dateRange[0], dateRange[1]) - 1} nights` :
                    " /night"}
                </p>
                {dateRange[1] !== null ?
                  <>
                    <p className='font-semibold'>
                      {"Total: "}
                      {formatValue({
                        value: JSON.stringify(totalPrice),
                        groupSeparator: '.',
                        decimalSeparator: ',',
                        prefix: 'Rp. ',
                      })}
                    </p>
                  </> :
                  <></>
                }
              </div>

              {dateRange[1] !== null ?
                <button onClick={handleReserve} className='btn btn-accent'>Reserve</button> :
                <button disabled className='btn btn-accent'>Reserve</button>
              }
            </div>
          </div>
        </div>
      </div>





    </Layout>
  )
}

export default DetailStay