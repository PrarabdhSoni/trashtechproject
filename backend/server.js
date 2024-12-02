// import modules
import jwt from 'jsonwebtoken';
import cors from 'cors';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import env from "dotenv";

// constant and middleware
const app = express();
env.config();
const port = process.env.PORTNUMBER;
const saltRounds = 10;
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// CONECTION TO DATABASE
const db = new pg.Client({
  user: process.env.USER_NAME,
  host: process.env.HOST_NAME,
  database: process.env.DATABASE_NAME,
  password: process.env.PASSWORD,
  port: process.env.PORT_NAME,
});
db.connect();



// SEND Conformation mail
const sendConfirmationEmail = async (email, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAILHOST,
    port: process.env.MAILPORT,
    auth: {
      user: process.env.MAILUSER,
      pass: process.env.MAILPASS,
    }
  });

  const mailOptions = {
    from: "justaddtrial@gmail.com",
    to: email,
    subject: subject,
    text: text,
  };

  await transporter.sendMail(mailOptions);
}

// Sign Up Page
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try{
    // checking for already register
    const check_result = await db.query("SELECT * FROM users WHERE email = $1",[username]
    );
    if (check_result.rows.length > 0) {
        res.send("Email is already registered. Try log In");
    }else{
        // encripting the password
        bcrypt.hash(password, saltRounds, async (err, hash) => {

          // Condition hashing
          if (err){
              console.log("problem in hashing the password", err);
          }else{

            // storing data
            const result = await db.query(
                "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id",
                [username, hash]
            );
            const userId = result.rows[0].id;

            // Generate a confirmation token
            const token = crypto.randomBytes(32).toString('hex');
            const expiresAt = new Date(Date.now() + 3600000);
            
            // Insert token into database
            await db.query('INSERT INTO confirmation_tokens(user_id, token, expires_at) VALUES($1, $2, $3)', [userId, token, expiresAt]);
            const subject = "Email Confirmation"
            const text = `
              <div style="font-family: Arial, sans-serif; text-align: center; background-color: #d1efc9; padding: 20px;">
                <p style="font-weight: bold; color: #000000">Please confirm your email by clicking the button below:</p>
                <a href="http://localhost:3000/confirm/${token}" style=" display: inline-block; padding: 10px 20px;font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;font-weight: bold;"> Confirm Email</a>
              </div>`
            ;

            // Send confirmation email
            await sendConfirmationEmail(username, subject, text);
            res.status(201).send('User registered');
          }
        })
    }
    }catch (err) {
        console.log(err);
    } 
});

// Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Query the database to find the user by email
    const userDetails = await db.query('SELECT * FROM users WHERE email = $1', [username]);

    if (userDetails.rows.length > 0) {
      const user = userDetails.rows[0];
      const storedHashedPassword = user.password;
      const match = await bcrypt.compare(password, storedHashedPassword);
      const active = user.is_active
      if(active){
        if (match) {
          const userId = user.id
          const token = jwt.sign({ userId }, `hifi`, { expiresIn: '1h' });
          res.status(200).json({ userId: userId, message: 'Login successful',token });
        } else {
          res.status(401).send('Invalid credentials');
        }
      } else {
        res.status(401).send('Invalid credentials');
      }
      
    } else {
      res.status(401).send('User not registered');
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Server error');
  }
});
  

// AUTHENTICATION VERIFY
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  if (!authHeader) {
    return res.status(403).json({ message: 'Invalid token' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Invalid token' });
  }

  jwt.verify(token, `hifi`, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.userId = decoded.userId; // Assuming userId is in the token
    next();
  });
};

// DASHBOARD
app.get('/home/:userId', authenticate, (req, res) => {
  const authenticateUserId = String(req.userId);
  const LogUserId = String(req.params.userId);

  // Check if the authenticated user ID matches the requested user ID
  if (authenticateUserId !== LogUserId) {
    console.log('Access forbidden: User ID mismatch');
    return res.status(403).json({ message: 'Access forbidden' });
  }

  // Return user-specific data
  res.json({ message: `Welcome to your home page, user ${LogUserId}`, authenticateUserId });
});

app.get('/wastepickup/:userId', authenticate, (req,res)=>{
  const authenticateUserId = String(req.userId);
  const LogUserId = String(req.params.userId);
  console.log(authenticateUserId)
  console.log(LogUserId)
  if (authenticateUserId !== LogUserId) {
    console.log('Access forbidden: User ID mismatch');
    return res.status(403).json({ message: 'Access forbidden' });
  }
  res.json({ message: `Welcome to your home page, user ${LogUserId}`, authenticateUserId });
})


// CONFORMATION TOKEN
app.post('/confirm/:token', async (req, res) => {
  try{
    const {token} = req.body
    const currentTime = new Date(Date.now() + 0);

    const result = await db.query('SELECT * FROM confirmation_tokens WHERE token = $1',[token])
    const confirmationToken = result.rows[0]

    if (confirmationToken) {
      const time = confirmationToken.expires_at
      if(time > currentTime){
        await db.query('UPDATE users SET is_active = TRUE WHERE id = $1', [confirmationToken.user_id]);
        const emailrow = await db.query("SELECT * FROM users WHERE id = $1",[confirmationToken.user_id]);
        const emaildata = emailrow.rows[0]
        const subject = "Welcome to KeepMee family"
        const text = "We hope you enjoy our services"
        const email = emaildata.email
        await sendConfirmationEmail(email, subject, text)
        const id = confirmationToken.user_id;
        await db.query("DELETE FROM confirmation_tokens WHERE user_id = $1", [id]);
      }else{
        const id = confirmationToken.user_id;
        await db.query("DELETE FROM users WHERE id = $1", [id]);
      }
    }else {
      console.log('incorrect link');
    }
  }catch(err){
    console.error('Error:', err);
  }
});

app.post('/forgotpassword', async (req, res) => {
  const {username}  = req.body;

  try{
    const check_result = await db.query("SELECT * FROM users WHERE email = $1",[username]);

    if (check_result.rows.length > 0) {
      console.log("i found you");
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 3600000);
      const userId = check_result.rows[0].id;
      
      // Insert token into database
      await db.query('INSERT INTO confirmation_tokens(user_id, token, expires_at) VALUES($1, $2, $3)', [userId, token, expiresAt]);
      const subject = "Change Password"
      const text = `Please change your password by clicking the link: http://localhost:3000/changepassword/${token}`
      // Send confirmation email
      await sendConfirmationEmail(username, subject, text);
      res.status(201).send('User registered');
    } else {

      res.status(401).send('Invalid credentials');
    }
  } catch(error){
    console.error('Error during Forgot Password Form Submision:', error);
    res.status(500).send('Server error');
  }
})

app.post('/changepassword/:token', async (req, res) =>{
  try {
    const {token} = req.body;
    const {username} = req.body
    const currentTime = new Date(Date.now() + 0);

    const result = await db.query('SELECT * FROM confirmation_tokens WHERE token = $1',[token])
    const confirmationToken = result.rows[0]

    if (confirmationToken) {
      const time = confirmationToken.expires_at
      if(time > currentTime){
        bcrypt.hash(username, saltRounds, async (err, hash) => {

          // Condition hashing
          if (err){
              console.log("problem in hashing the password", err);
          }else{
            await db.query('UPDATE users SET password = $1 WHERE id = $2', [hash, confirmationToken.user_id]);
            const emailrow = await db.query("SELECT * FROM users WHERE id = $1",[confirmationToken.user_id]);
            const emaildata = emailrow.rows[0]
            const subject = "Security Alert 🚨"
            const text = "Password Changed Sucessfully"
            const email = emaildata.email
            await sendConfirmationEmail(email, subject, text)
            const id = confirmationToken.user_id;
            await db.query("DELETE FROM confirmation_tokens WHERE user_id = $1", [id]);
          }
        })

      }else{
        const id = confirmationToken.user_id;
        await db.query("DELETE FROM users WHERE id = $1", [id]);
      }
    }else {
      console.log('incorrect link');
    }
  }catch(err){
    console.error('Error:', err);
  }
})

app.get('/api/unavailable-slots/:date', async (req, res) => {
  const { date } = req.params; // Extract date from route params


  try {
    const result = await db.query(
      'SELECT time_slot FROM unavailable_slots WHERE booking_date = $1',
      [date]
    );

    // Return the time_slot array
    res.json(result.rows.map((row) => row.time_slot));
  } catch (error) {
    console.error('Error fetching unavailable slots:', error.message);
    res.status(500).send('Server error');
  }
});


app.post('/api/book', async (req, res) => {
  const {
    name, 
    mobile_number, 
    address, 
    state_name, 
    city_name, 
    waste_type, 
    booking_date, 
    time_slot, 
    latitude, 
    longitude, 
    outlet_name, 
    distance, 
    delivery_cost,
    user_id,
  } = req.body;
  const paid = 'false'
  console.log("Received Data:", req.body); // Ensure that the data is correct

  try {
    // Insert booking into the bookings table
    await db.query(
      `INSERT INTO bookings 
      (name, mobile_number, address, state_name, city_name, waste_type, booking_date, time_slot, latitude, longitude, outlet_name, distance, delivery_cost, user_id, paid) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
      [
        name, 
        mobile_number, 
        address, 
        state_name, 
        city_name, 
        waste_type, 
        booking_date, 
        time_slot, 
        latitude, 
        longitude, 
        outlet_name, 
        distance, 
        delivery_cost,
        user_id,
        paid,
      ]
    );

    // Mark the slot as unavailable
    await db.query(
      `INSERT INTO unavailable_slots (booking_date, time_slot, city_names) VALUES ($1, $2, $3)`,
      [booking_date, time_slot, city_name]
    );

    res.send('Booking confirmed!');
  } catch (error) {
    console.error("Error in booking:", error.message);
    res.status(500).send('Error booking slot');
  }
});

app.get('/bookings/:userId', async (req, res) => {
  const userId = String(req.params.userId);
  try {
    const result = await db.query(
      'SELECT * FROM bookings WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result);
  } catch (error) {
    console.error('Error fetching unavailable slots:', error.message);
    res.status(500).send('Server error');
  }
})



// Admin Api
app.post('/admin', async (req, res) => {
  const { username } = req.body; // Get `username` from the request body

  try {
    // Query the database for the username
    const userDetails = await db.query('SELECT * FROM admin WHERE username = $1', [username]);

    // Check if the user exists
    if (userDetails.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' }); // Send a 404 response
    }

    // Extract user details
    const user = userDetails.rows[0];
    const id = user.username;


    // Password generation logic
    if (username === id) {
      console.log(id)
      console.log(username)
      let password = '';

      const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const numbers = '0123456789';
      const symbols = '!#$%&()*+';

      // Generate random characters for the password
      for (let i = 0; i < 3; i++) {
        password += letters.charAt(Math.floor(Math.random() * letters.length));
        password += numbers.charAt(Math.floor(Math.random() * numbers.length));
        password += symbols.charAt(Math.floor(Math.random() * symbols.length));
      }

      // Shuffle the password
      const shuffled = password.split('').sort(() => Math.random() - 0.5).join('');

      // Send OTP email
      const subject = 'Hi Admin, Get Your OTP';
      const email = 'pscs.prarabdhsoni2005@gmail.com';
      const text = `
        <div style="color: blue; font-size: 20px; text-align: center; background-color: #d1efc9;">
          <h1><span style="color: black;">Your OTP is</span> ${shuffled}</h1>
        </div>
      `;

      // Send confirmation email
      await sendConfirmationEmail(email, subject, text);
      console.log('send have')

      // Update the user's password in the database
      await db.query('UPDATE admin SET password = $1 WHERE username = $2', [shuffled, username]);
      console.log('password update')
      // Send a success response
      res.status(200).json({ message: 'OTP sent successfully', otp: shuffled });
      console.log('all done')
    } else {
      // If the username doesn't match
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    // Catch and handle any errors
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/admin/verify', async (req, res) =>{
  const  {username, password} = req.body

  try{
    const userDetails = await db.query('SELECT * FROM admin WHERE username = $1', [username]);

    // Check if the user exists
    if (userDetails.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' }); // Send a 404 response
    }

    // Extract user details
    const user = userDetails.rows[0];
    const id = user.username;
    const pass = user.password;

    if (username === id | pass === password){
      console.log('Verified')
      const token = jwt.sign({ username }, `admin`, { expiresIn: '1h' });
      res.status(200).json({ token });
      res.status(200).json('Login successful');
    } else{
      res.status(401).send('User not registered');
    }
  } catch{

  }
})

app.get('/Abookings', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM bookings ORDER BY created_at DESC');
    res.json(result);
  } catch (error) {
    console.error('Error fetching unavailable slots:', error.message);
    res.status(500).send('Server error');
  }
})

app.get('/analysis', async (req, res) => {
  try {
    const result = await db.query('SELECT id, delivery_cost, created_at, paid FROM bookings');
    console.log(result.rows)
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching unavailable slots:', error.message);
    res.status(500).send('Server error');
  }
})

app.get('/api/users', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users');
    console.log(result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching unavailable slots:', error.message);
    res.status(500).send('Server error');
  }
})

app.post('/newemployees', async (req, res)=>{
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    hireDate,
    jobTitle,
    salary,
    manager_id,
    department,
    isActive,
    employeeId,
  } = req.body;
  console.log("Received Data:", req.body); // Ensure that the data is correct

  try {
    // Insert booking into the bookings table
    await db.query(
      `INSERT INTO employee 
      (first_name, last_name, email, phone_number, hire_date, job_title, salary, is_active, employee_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        firstName, 
        lastName, 
        email, 
        phoneNumber, 
        hireDate, 
        jobTitle, 
        salary, 
        isActive, 
        employeeId,
      ]
    );
    console.log(department)
    console.log(manager_id)
  } catch (error) {
    console.log(error)
  }
})




















// App Server
app.get('/app/home', authenticate, (req,res) => {
  const {token , userId} = req.body;

  jwt.verify(token, `hifi`, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    userId = decoded.userId; // Assuming userId is in the token
    next();
  });

  // Check if the authenticated user ID matches the requested user ID
  if (authenticateUserId !== LogUserId) {
    console.log('Access forbidden: User ID mismatch');
    return res.status(403).json({ message: 'Access forbidden' });
  }
  console.log('Hi')
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
