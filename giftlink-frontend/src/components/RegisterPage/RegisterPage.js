import React, { useState } from 'react';

import './RegisterPage.css';

function RegisterPage() {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // insert code here to create handleRegister function and include console.log
    const handleRegister = async () => {
        console.log("Register button clicked");
    }

         return (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <div className="register-card p-4 border rounded">
                            <h2 className="text-center mb-4 font-weight-bold">Register</h2>
                            <div className="mb-4">
                                <label>First Name</label>
                                <input type="text" id='firstName' className="form-control" placeholder="Enter first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                <label>Last Name</label>
                                <input type="text" id='LastName' className="form-control" placeholder="Enter Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                <label>email</label>
                                <input type="text" id='email' className="form-control" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <label>Password</label>
                                <input type="password" id='password' className="form-control" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <button onClick={handleRegister} className="btn btn-primary btn-block">Register</button>
                        <p className="mt-4 text-center">
                            Already a member? <a href="/app/login" className="text-primary">Login</a>
                        </p>

                         </div>
                    </div>
                </div>
            </div>

         )//end of return
}

export default RegisterPage;