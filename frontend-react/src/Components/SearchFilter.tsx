import React from 'react'
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2'

interface SearchProps {
    handleClick?: React.MouseEventHandler
}

const SearchFilter: React.FC<SearchProps> = ({ handleClick }) => {
    return (
        <div className='w-full'>
            <button onClick={handleClick} className='normal-case flex justify-between items-center w-full text-white font-light btn btn-primary'>
                <p>Search</p>
                <HiOutlineMagnifyingGlass />
            </button>
        </div>
    )
}

export default SearchFilter