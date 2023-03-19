import React, { useEffect } from 'react';
import { Rating } from '@smastrom/react-rating';
import axios from 'axios';
import { useCookies } from 'react-cookie';

interface CommentProps {
    id: number;
    user: string;
    image: string;
    date: string;
    rating: number;
    comment: string;
}

const CommentCard: React.FC<CommentProps> = ({ id, user, image, date, rating, comment }) => {
    const StarDrawing = (
        <path d="M11.0748 3.25583C11.4141 2.42845 12.5859 2.42845 12.9252 3.25583L14.6493 7.45955C14.793 7.80979 15.1221 8.04889 15.4995 8.07727L20.0303 8.41798C20.922 8.48504 21.2841 9.59942 20.6021 10.1778L17.1369 13.1166C16.8482 13.3614 16.7225 13.7483 16.8122 14.1161L17.8882 18.5304C18.1 19.3992 17.152 20.0879 16.3912 19.618L12.5255 17.2305C12.2034 17.0316 11.7966 17.0316 11.4745 17.2305L7.60881 19.618C6.84796 20.0879 5.90001 19.3992 6.1118 18.5304L7.18785 14.1161C7.2775 13.7483 7.1518 13.3614 6.86309 13.1166L3.3979 10.1778C2.71588 9.59942 3.07796 8.48504 3.96971 8.41798L8.50046 8.07727C8.87794 8.04889 9.20704 7.80979 9.35068 7.45955L11.0748 3.25583Z" stroke="#fdd231" stroke-width="1" ></path>
    );

    const customStyles = {
        itemShapes: StarDrawing,
        activeFillColor: '#fdd231',
        inactiveFillColor: '#0b3c95',

    };

    return (
        <div className="rounded-lg w-full bg-primary shadow-xl py-4 sm:px-10 px-2">
            <div className='flex gap-4'>
                <div className='flex flex-col gap-2'>
                    <img src={image} className='rounded-full object-cover w-20 h-20' alt="not found" />
                    <Rating
                        value={rating}
                        style={{ maxWidth: 80, minWidth: 80 }}
                        itemStyles={customStyles}
                        readOnly
                    />

                </div>

                <div className='flex flex-col'>
                    <h2 className="line-clamp-1 font-semibold">{user}</h2>
                    <p>{comment}</p>
                </div>
            </div>
        </div>
    )
}

export default CommentCard