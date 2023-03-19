import React from 'react';
import { AiFillStar } from 'react-icons/ai';
import { useNavigate } from 'react-router';

interface ListingProps {
    id: number;
    location: string;
    rating: number;
    available: string;
    price: number;
    image: string;
    edit?: boolean
    toDelete?: boolean
    handleEdit?: React.MouseEventHandler
    handleDelete?: React.MouseEventHandler
    name?: string
    handlename?: boolean
}


const ListingCards: React.FC<ListingProps> = ({
    id,
    location,
    rating,
    available,
    price,
    image,
    edit,
    handleDelete,
    handleEdit,
    toDelete,
    name,
    handlename
}) => {

    const navigate = useNavigate()

    return (
        <div className='flex relative justify-center w-full mx-auto'>
            <button onClick={() => navigate(`/stays/${id}`)} className="card w-full bg-primary shadow-xl p-0">
                <figure>
                    <img 
                    className='object-cover w-screen h-60' 
                    src={image}
                    onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src="https://www.nj.com/resizer/QgEkPOPu3r2bkqGAf7DjtCH7sJM=/1280x0/smart/cloudfront-us-east-1.images.arcpublishing.com/advancelocal/HK5EHPHYX5CR7BS2E5TGVHZBGE.JPG";
                      }}
                    />
                </figure>
                <div className="card-body p-0 py-5 mx-5">
                    <h2 className="card-title text-lg justify-between w-full">
                        {location}
                        <div className="badge badge-accent"><AiFillStar />{rating}</div>
                    </h2>
                    <p className={`font-light text-start ${available ? "hidden" : "static"}`}>{available}</p>
                    <p className='font-light text-start'>{name}</p>
                    <p className='font-light text-start'>Rp. {price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")} / night</p>
                </div>
            </button>

            <div className={`flex flex-col font-semibold ${edit ? "absolute bottom-5 right-3" : "hidden"}`}>
                <p className='text-accent hover:cursor-pointer' onClick={handleEdit}>
                    edit
                </p>
                <p className='text-warning hover:cursor-pointer' onClick={handleDelete}>
                    delete
                </p>
            </div>
        </div>
    )
}

export default ListingCards