import React, { useState, useRef } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Girl from '../asset/signin_girl.png';
import './Register.css';

const cookies = new Cookies();
const Register = () => {
	const [register, setRegister] = useState({});
	const [error, setError] = useState();
	const refInput = useRef();
	const navigate = useNavigate();
	const [showhide, setShowhide] = useState('');

	const isValidEmail = (email) => {
		return /\S+@\S+\.\S+/.test(email);
	}

	const handleshowhide = (event) => {
		const getuser = event.target.value;
		setShowhide(getuser);
	};

	const handleClick = async () => {
		try {
			console.log('clicked');
			const axiosConfig = {
				headers: { 'Content-Type': 'application/json' },
			};
			let postData = {
				email: refInput.current[0].value,
				name: refInput.current[1].value,
				password: refInput.current[2].value,
				role: refInput.current[3].value,
			};
			if (showhide === 'doctor') {
				postData = {
					email: refInput.current[0].value,
					name: refInput.current[1].value,
					password: refInput.current[2].value,
					role: refInput.current[3].value,
					doctorType: refInput.current[4].value,
				};
			}
			if(postData.email === '' || postData.name === '' || postData.password === '' || postData.role === '' || postData.doctorType === ''){
				alert("Please filled in all fields!")
			}
			else if(!isValidEmail(postData.email)){
				alert("Please enter a valid email!")
			}
			else if(postData.password.length < 6){
				alert("Password must have at least 6 characters!")
			}
			else{
				axios.post('/api/auth/register', postData, axiosConfig).then(
					(response) => {
						setRegister(response);
						console.log(response);
						if (response.data.role === 'patient') {
							navigate('/record-checker', { replace: true });
						} else {
							navigate('/dhome', { replace: true });
						}
					},(reason) => {
						console.error(reason);
						setError('Email already registered.');
					}
				);
			}
			// let axiosConfig = {
			// 	headers: {
			// 		'Content-Type': 'application/json',
			// 	},
			// };

			// let postData = {
			// 	email: refInput.current[0].value,
			// 	password: refInput.current[2].value,
			// };
			// setTimeout(3);
			// axios
			// 	.post(`/api/auth/login`, postData, axiosConfig, {
			// 		withCredentials: true,
			// 		crendentials: true,
			// 	})
			// 	.then((response) => {
			// 		console.log(response);
			// 		if (response.status === 200) {
			// 			cookies.set('access_token', response.data, { path: '/' });
			// 		}
			// 		if (response.data.role === 'Patient') {
			// 			navigate('/phome', { replace: true });
			// 		} else {
			// 			navigate('/dhome', { replace: true });
			// 		}
			// 	});
		} catch (error) {
			setError(error);
		}
	};
	return (
		<>
			<Navbar />
			<div className='RegWrapper'>
				<div className='RegContainer'>
					<div className='RegInfo'>
						<b>Sign up for</b>
						<span class='eldercare'>
							<span>E</span>
							<span>l</span>
							<span>d</span>
							<span>e</span>
							<span>r</span>
							<span>C</span>
							<span>a</span>
							<span>r</span>
							<span>e</span>
						</span>
						<c>
							<p>With just a few simple steps.</p>
							<d>Have an account? Sign in</d>
							<a href='/' className='register'>
								{' '}
								here!
							</a>
						</c>
					</div>
					<div className='girl'>
						<img className='girl' src={Girl} alt='girl'></img>
					</div>
					<div className='Register'>
						<h1>Sign Up</h1>
						<form ref={refInput}>
							<input
								className='credentials'
								type='text'
								name='Email'
								placeholder='Enter Email'
							/>
							<input
								className='credentials'
								type='text'
								name='Name'
								placeholder='Full Name'
							/>
							<input
								className='credentials'
								type='password'
								name='Password'
								placeholder='Password'
							/>
							<select className='form-role' onChange={(e) => handleshowhide(e)}>
								<option value=''>--Select User Type--</option>
								<option value='doctor'>Doctor</option>
								<option value='patient'>Patient</option>
							</select>
							{showhide === 'doctor' && (
								<input
									className='credentials'
									type='text'
									name='docType'
									placeholder='Doctor Type'
								></input>
							)}
						</form>

						<button className='RegisterButton' onClick={handleClick}>
							Register
						</button>
						{register.email && <div>{register.name} has been registered! </div>}
						{register.errors && <div>{register.errors.msg} </div>}
						{error ? <div>{error}</div> : null}
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default Register;
