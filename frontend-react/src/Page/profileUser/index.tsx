import React, { useState } from 'react'
import Layout from '../../Components/Layout'
import Navbar from '../../Components/Navbar'
import Button from '../../Components/Button'
import Modal from '../../Components/Modal'
import { FaPenSquare } from 'react-icons/fa'
import { FaRoad } from 'react-icons/fa'

const ProfileUSer = () => {

    const [showModal, setShowModal] = useState(false)

    return (
        <Layout>
            <Navbar />
            <div className="text-white mt-10 w-9/12">
                <h1 className='text-4xl w-60 font-bold'>Personal Information</h1>
                <div className="grid grid-cols-2">
                    <div className="flex flex-col mt-10 space-y-3 w-60">
                        <div>
                            <label htmlFor="name" className='text-l font-semibold'>
                                Name
                            </label>
                            <p className='text-slate-300 text-l'>Marvin Mckiney</p>
                        </div>
                        <div>
                            <label htmlFor="email" className='text-l font-semibold'>
                                Email
                            </label>
                            <p className='text-slate-300 text-l italic'>Marvin@gmail.com</p>
                        </div>
                        <div>
                            <label htmlFor="phone_number" className='text-l font-semibold'>
                                Phone Number
                            </label>
                            <p className='text-slate-300 text-l'>08923674327</p>
                        </div>
                        <div>
                            <label htmlFor="address" className='text-l font-semibold'>
                                Address
                            </label>
                            <p className='text-slate-300 text-l'>
                                4140 Parker Rd. Allentown, New Mexico 31134
                            </p>
                        </div>
                    </div>
                    <div className="flex w-20 ml-10 space-x-2 mt-8">
                        <Button
                            color='btn-accent'
                            size='btn-sm text-xl'
                            children={<FaPenSquare />}
                        />
                        <Button
                            color='btn-white'
                            size='btn-sm text-xl'
                            children={<FaRoad />}
                        />
                    </div>
                </div>
                <div className="flex flex-col w-5/6 justify-between mt-10 space-y-3">
                    <Button
                        color='btn-accent'
                        size='w-full'
                        children={' Make your home a BnB ? '}
                        onClick={() => setShowModal(true)}
                    />
                </div>
                <div className="flex w-5/6 justify-between mt-40">
                    <Button
                        color='btn-warning text-white'
                        children={'Delete Account'}
                    />
                </div>
            </div>
            <Modal
                isOpen={showModal}
                isClose={() => setShowModal(false)}
                size='w-80'
            >
                <div className="flex flex-col justify-center">
                    <h1 className='text-2xl text-center'>Are you sure you want to make your home a BnB?</h1>
                    <div className="flex flex-row justify-center space-x-4">
                        <Button
                            color="btn-warning"
                            size='mt-5'
                            children={"Cancel"}
                        />
                        <Button
                            color="btn-accent"
                            size='mt-5'
                            children={"Yes, I Sure"}
                        />
                    </div>

                </div>
            </Modal>

        </Layout>
    )
}

export default ProfileUSer