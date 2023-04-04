import React, { useContext, useEffect, useState, useRef } from 'react';
import { UserContext } from '../../contexts/user.context';
import {
  updateUserWilks,
  getUserWilks,
  deleteUserWilks,
} from '../../utils/firebase/firebase.utils';
import WilksChart from './WilksChart';
import './Wilks.css';

const Wilks = () => {
  let [wilks, setWilks] = useState(0);
  let [total, setTotal] = useState(0);
  let [weight, setWeight] = useState(0);
  let [gender, setGender] = useState('');
  let [type, setType] = useState('lbs');
  let [wilksScores, setWilksScores] = useState([]);

  const { currentUser } = useContext(UserContext);
  const isFirstRender = useRef(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (currentUser && wilks > 0) {
      console.log(currentUser);
      const date = new Date();
      updateUserWilks({ total, weight, date, wilks, type });
    }
  }, [wilks]);

  useEffect(() => {
    if (!currentUser) return;

    const fetchData = async () => {
      let data = await getUserWilks();
      setWilksScores(data.wilksScores);
    };
    fetchData();
    renderWilksData();
  }, [currentUser, wilksScores]);

  const calcWilks = () => {
    let num = 0;
    if (gender === 'male' && type === 'kgs') {
      num =
        total *
        (500 /
          (-216.0475144 +
            16.2606339 * weight +
            -0.002388645 * weight ** 2 +
            -0.00113732 * weight ** 3 +
            7.01863e-6 * weight ** 4 +
            -1.291e-8 * weight ** 5));
    } else if (gender === 'female' && type === 'kgs') {
      num =
        total *
        (500 /
          (594.31747775582 +
            -27.23842536447 * weight +
            0.82112226871 * weight ** 2 +
            -0.00930733913 * weight ** 3 +
            4.731582e-5 * weight ** 4 +
            -9.054e-8 * weight ** 5));
    } else if (gender === 'male' && type === 'lbs') {
      num =
        (total / 2.205) *
        (500 /
          (-216.0475144 +
            16.2606339 * (weight / 2.205) +
            -0.002388645 * (weight / 2.205) ** 2 +
            -0.00113732 * (weight / 2.205) ** 3 +
            7.01863e-6 * (weight / 2.205) ** 4 +
            -1.291e-8 * (weight / 2.205) ** 5));
    } else if (gender === 'female' && type === 'lbs') {
      num =
        (total / 2.205) *
        (500 /
          (594.31747775582 +
            -27.23842536447 * (weight / 2.205) +
            0.82112226871 * (weight / 2.205) ** 2 +
            -0.00930733913 * (weight / 2.205) ** 3 +
            4.731582e-5 * (weight / 2.205) ** 4 +
            -9.054e-8 * (weight / 2.205) ** 5));
    }
    setWilks(num.toFixed(2));
  };

  const renderWilksJumbo = () => {
    return (
      <div className='jumbotron jumbotron-fluid wilks'>
        <div className='container centered'>
          <h1 className='display-4 animated fadeIn'>Wilks</h1>
          <p className='lead animated slideInUp' style={{ fontWeight: 400 }}>
            The Wilks Formula is a coefficient that can be used to measure the
            strength of a powerlifter against other powerlifters despite the
            different weights of the lifters.
          </p>
        </div>
      </div>
    );
  };

  const renderWilksCalc = () => {
    return (
      <form className='container'>
        <div className='row wilks-calc'>
          <div className='col'>
            <div className='my-1 mb-4'>
              <label className='' htmlFor='inlineFormCustomSelect'>
                Gender
              </label>
              <select
                className='custom-select'
                id='inlineFormCustomSelect'
                required
                onChange={(e) => setGender(e.target.value)}
              >
                <option value=''>Choose...</option>
                <option value='male'>Male</option>
                <option value='female'>Female</option>
              </select>
            </div>
            <div className='form-group'>
              <label htmlFor='weight'>Bodyweight</label>
              <input
                type='text'
                required
                className='form-control'
                id='weight'
                aria-describedby='weightHelp'
                placeholder={`Enter weight in ${type}`}
                onChange={(e) => setWeight(e.target.value)}
              />
              <small
                id='weightHelp'
                className='form-text text-muted font-italic'
              >
                Weight of the lifter in {type}
              </small>
            </div>
            <div className='form-group'>
              <label htmlFor='exampleInputPassword1'>Total</label>
              <input
                type='text'
                required
                className='form-control'
                id='total'
                placeholder={`Enter total in ${type}`}
                onChange={(e) => setTotal(e.target.value)}
              />
              <small
                id='totalHelp'
                className='form-text text-muted font-italic'
              >
                Total weight of the 3 big lifts in {type}. Deadlift / Squat /
                Bench
              </small>
            </div>
            <div className='wilks-buttons'>
              <div
                className='btn-group'
                role='group'
                aria-label='Basic example'
              >
                <button
                  type='button'
                  className={`btn ${
                    type === 'lbs' ? 'btn-info' : 'btn-secondary'
                  }`}
                  onClick={() => setType('lbs')}
                >
                  lbs
                </button>
                <button
                  type='button'
                  className={`btn ${
                    type === 'kgs' ? 'btn-info' : 'btn-secondary'
                  }`}
                  onClick={() => setType('kgs')}
                >
                  kgs
                </button>
              </div>
              <button
                type='button'
                className='btn btn-primary'
                onClick={calcWilks}
              >
                Submit
              </button>
            </div>
          </div>

          <div className='col centered'>
            <h1 className='display-3'>{wilks}</h1>
          </div>
        </div>
      </form>
    );
  };

  const renderWilksDataList = () => {
    return wilksScores.map((wilks, index) => {
      return (
        <div
          className='list-group-item list-group-item-dark wilks-item'
          key={index}
        >
          <h3>
            {Number(wilks.weight).toFixed(0)}
            <span style={{ fontSize: '10px' }}>{wilks.type}</span>
          </h3>
          <h3>
            {Number(wilks.total).toFixed(0)}{' '}
            <span style={{ fontSize: '10px' }}>{wilks.type}</span>
          </h3>
          <h3>{wilks.wilks}</h3>
          <button
            onClick={() => deleteUserWilks(wilks)}
            className='btn btn-danger grow'
          >
            Delete
          </button>
        </div>
      );
    });
  };

  const renderWilksData = () => {
    if (currentUser) {
      return (
        <div className='wilks-data container mt-3'>
          <h2 className='scores-header centered'>
            {currentUser.displayName}'s scores
          </h2>
          {wilksScores > 0 ? (
            <div className='wilks-data-titles'>
              <span>Bodyweight</span>
              <span>Total</span>
              <span>Wilks</span>
            </div>
          ) : (
            <p className='centered'>No scores to show</p>
          )}
          <div className='list-group-flush'>{renderWilksDataList()}</div>
        </div>
      );
    } else {
      return (
        <div className='wilks-data centered container mt-3'>
          <span className=''>Sign-In to keep track of your wilks scores!</span>
        </div>
      );
    }
  };

  const renderWilksInformation = () => {
    if (wilks == 0) {
      return (
        <i>Enter in some data and see where you land in your lifting journey</i>
      );
    } else {
      return (
        <h3>
          ({gender}){' '}
          <span style={{ color: 'lightgreen' }}>
            {Number(total).toFixed(0)}
          </span>
          {type} total @
          <span style={{ color: 'orange' }}>{Number(weight).toFixed(1)}</span>
          {type} bodyweight ={' '}
          <span style={{ color: 'lightblue' }}>{wilks}</span>
        </h3>
      );
    }
  };

  return (
    <div>
      <div>{renderWilksJumbo()}</div>
      <div className='wilks-section'>{renderWilksCalc()}</div>
      <div>{renderWilksData()}</div>
      <div className='wilks-chart'>
        <h1>Wilks Comparison Chart</h1>
        {renderWilksInformation()}
        <WilksChart />
      </div>
    </div>
  );
};

export default Wilks;
