import axios from 'axios';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function PaymentForm(item) {
  const [cardno, setCardno] = useState('');
  const [nameoncard, setNameoncard] = useState('');
  const [amount, setAmount] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !cardno || !nameoncard) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please provide all information',
      });
      return;
    }

    if (Number(amount) < 100) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Amount must be greater than or equal to 100',
      });
      return;
    }
    // const rent = parseFloat(item?.id?.rent) || 0;
    // const lightbill = parseFloat(item?.id?.ebill) || 0;
    // const totalAmountDue = rent + lightbill;
      
    // if (amount < totalAmountDue) {
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Error',
    //     text: `Amount must be greater than or equal to the total amount due ${totalAmountDue}`,
    //   });
    //   return;
    //   }
      
    try {
      const data = {
        apid: item?.id?._id,
        userid: sessionStorage.getItem('id'),
        cardno: cardno,
        nameoncard: nameoncard,
        amount: amount,
      };

      const response = await axios.post('http://localhost:8081/payment', data);

      Swal.fire({ title: 'Payment successful' });
      navigate('/');
    } catch (error) {
      Swal.fire({
        title: 'Payment failed',
        text: error.response?.data?.error || 'Unknown error',
      });
    }
  };

    return (
        <div style={{ marginLeft: '70px' }}>
            <h5>Payment Details</h5>
            <form>
                <div>
                    <div className='mb-3 row'>
                        <label className='col-sm-4 col-form-label'>Card No</label>
                        <div className='col-sm-8'>
                            <input
                                type='text'
                                onChange={(e) => setCardno(e.target.value)}
                                maxLength={16}
                                minLength={16}
                                placeholder='Card No'
                                className='form-control'
                            />
                        </div>
                    </div>
                    <div className='mb-3 row'>
                        <label className='col-sm-5 col-form-label'>Name on Card</label>
                        <div className='col-sm-7'>
                            <input
                                type='text'
                                onChange={(e) => setNameoncard(e.target.value)}
                                placeholder='Name on Card'
                                className='form-control'
                            />
                        </div>
                    </div>
                    <div className='mb-3 row'>
                        <label className='col-sm-4 col-form-label'>Rent</label>
                        <div className='col-sm-8'>
                            <input
                                type='number'
                                value={item?.id?.rent}
                                disabled
                                className='form-control'
                            />
                        </div>
                    </div>
                    <div className='mb-3 row'>
                        <label className='col-sm-5 col-form-label'>Electricity Bill</label>
                        <div className='col-sm-7'>
                            <input
                                type='number'
                                value={item?.id?.ebill}
                                disabled
                                className='form-control'
                            />
                        </div>
                    </div>
                    <div className='mb-3 row'>
                        <label className='col-sm-6 col-form-label'>Booking Amount</label>
                        <div className='col-sm-6'>
                            <input
                                type='number'
                                
                                onChange={(e) => setAmount(e.target.value)}
                                className='form-control'
                                placeholder='Booking Amount'
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleSubmit}
                        className='btn btn-primary float-end'
                    >
                        Pay Now
                    </button>
                </div>
            </form>
        </div>
    );
}
