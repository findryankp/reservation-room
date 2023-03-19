import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { FaRegStar } from 'react-icons/fa'
import { FaStar } from 'react-icons/fa'
import { Rating } from '@smastrom/react-rating'

interface FeedBackProps {
    id: number;
    location: string;
    dateStart: string;
    dateEnd: string
    price: number;
    edit?: boolean
    toDelete?: boolean
    duration?: number
    handleFeedback?: React.MouseEventHandler
    handleEdit?: React.MouseEventHandler
    value?: any
}


const FeedBackCard: React.FC<FeedBackProps> = ({
    id,
    location,
    dateStart,
    price,
    edit,
    duration,
    dateEnd,
    handleEdit,
    handleFeedback,
    toDelete,
    value
}) => {

    const navigate = useNavigate()

    const total = price * 5

    // const ratings = Array(5).fill(0)
    const [currentValue, setCurrentValue] = useState(0)
    const [hoverValue, setHoverValue] = useState(undefined)

    const StarDrawing = (
        <path d="M11.0748 3.25583C11.4141 2.42845 12.5859 2.42845 12.9252 3.25583L14.6493 7.45955C14.793 7.80979 15.1221 8.04889 15.4995 8.07727L20.0303 8.41798C20.922 8.48504 21.2841 9.59942 20.6021 10.1778L17.1369 13.1166C16.8482 13.3614 16.7225 13.7483 16.8122 14.1161L17.8882 18.5304C18.1 19.3992 17.152 20.0879 16.3912 19.618L12.5255 17.2305C12.2034 17.0316 11.7966 17.0316 11.4745 17.2305L7.60881 19.618C6.84796 20.0879 5.90001 19.3992 6.1118 18.5304L7.18785 14.1161C7.2775 13.7483 7.1518 13.3614 6.86309 13.1166L3.3979 10.1778C2.71588 9.59942 3.07796 8.48504 3.96971 8.41798L8.50046 8.07727C8.87794 8.04889 9.20704 7.80979 9.35068 7.45955L11.0748 3.25583Z" stroke="#fdd231" stroke-width="1" ></path>
    );

    const customStyles = {
        itemShapes: StarDrawing,
        activeFillColor: '#fdd231',
        inactiveFillColor: '#0b3c95',

    };
    return (
        <div className='flex relative justify-start w-full mx-auto'>
            <div className="card w-full bg-primary shadow-xl p-0">
                <div className="card-body px-5 py-5">
                    <h2 className="card-title text-xl text-start">
                        {location}
                    </h2>
                    <p className='font-light text-start'> Check In : {dateStart}</p>
                    <p className='font-light text-start'> Check Out : {dateEnd}</p>
                    <p className='font-light text-start'>Rp. {price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")} x {duration} night</p>
                    <p className='font-light text-start'>Total: Rp. {total.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}</p>
                    <div className="rating">
                        <Rating
                            value={value}
                            style={{ maxWidth: 120 }}
                            itemStyles={customStyles}
                            readOnly
                        />
                    </div>
                </div>
            </div>
            <button
                className={`btn btn-sm absolute bottom-1 right-3 ${value === 0 ? "btn-accent text-primary" : "btn-outline btn-accent"}`}
                onClick={value === 0 ? handleFeedback : handleEdit}
            >
                {value === 0 ? "Give Review" : "Edit Review"}
            </button>
        </div>
    )
}

export default FeedBackCard