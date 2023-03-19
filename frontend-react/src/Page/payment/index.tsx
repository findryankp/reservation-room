import React,{useState} from 'react'

//Component
import Layout from '../../Components/Layout'
import Navbar from '../../Components/Navbar'
import Input from '../../Components/Input'
import Button from '../../Components/Button'
import Modal from '../../Components/Modal'

import { IoMdDoneAll } from "react-icons/io";

interface FormValues{
  cardNumber: any
  cvv: string
  validUntil: string
  cardHolderName: string
}
const initialFormValues: FormValues = {
  cardNumber: '',
  cvv: '',
  validUntil: '',
  cardHolderName: ''
};

const Payment = () => {

  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
  const [showSuccess, setShowSuccess] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormValues(initialFormValues);
  };

  return (
    <Layout>
      <Navbar
      children={<h1 className="font-bold text-2xl">Payment</h1>}
      />
        <div className="text-white mt-10 w-11/12">
          <form onSubmit={handleSubmit}>
          <h1 className='text-3xl w-full font-bold'>Villa Puncak 6 Kamar, Kolam Renang</h1>
                      <div className="flex flex-col mt-10 space-y-3 w-full justify-items-center">
                            <div className='jusrify-items-center'>
                                <Input
                                    type='number'
                                    label='Card Number'
                                    name='card_number'
                                    value={formValues.cardNumber}
                                    onChange={handleInputChange}
                                    placeholder='010101-010101-01010'
                                />
                            </div>
                            <div className='flex flex-row space-x-8'>
                                <div className="w-36">
                                  <Input
                                      type='text'
                                      label='Valid Until'
                                      name='valid_until'
                                      value={formValues.validUntil}
                                      onChange={handleInputChange}
                                      placeholder='09/09/2029'
                                  />
                                </div>
                                <div className="w-36">
                                  <Input
                                      type='text'
                                      label='CVV'
                                      name='cvv'
                                      value={formValues.cvv}
                                      onChange={handleInputChange}
                                      placeholder='XXX'
                                  />
                                </div>
                            </div>
                            <div>
                                <Input
                                    type='text'
                                    label='Card Holder name'
                                    name='card_holder_name'
                                    value={formValues.cardHolderName}
                                    onChange={handleInputChange}
                                    placeholder='Michael'
                                />
                            </div>                    
                      </div>
                      <div className='my-10'>
                        <p>
                          Booking Date: April 10-15
                        </p>
                        <p>
                          Rp.2.500.000 x 5 nigths
                        </p>
                      </div>
                      <div className='mb-10 text-accent font-semibold'>
                        <p>
                          Total: Rp.12.500.000
                        </p>
                      </div>
                      <div className="flex flex-row w-full justify-center mb-10">
                        <Button
                        color='btn-accent'
                        children='Make Payment'
                        onClick={()=>setShowSuccess(true)}
                        />
                      </div>  
          </form>            
        </div>
        <Modal
        isOpen={showSuccess}
        isClose={()=>setShowSuccess(false)}
        size='w-80'
        >
          <div className="flex justify-center">
          <IoMdDoneAll className='text-7xl'/>
          </div>
            <div className="flex flex-col justify-center mt-2">
                <h1 className='text-2xl text-center'>Payment Success</h1>
                <div className="flex flex justify-center">
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

export default Payment