const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();


exports.register = (req,res) =>{
    const { name, email, phone, password} = req.body;
    if( !name || !email || !password){
        return res.status(400).json({message: 'Please fill in all required fields'});

    }


    const checkQuery = `SELECT * FROM users  WHERE  email = ?`;
    db.query(checkQuery,[email],async (err,result) => {
        if(err) return res.status(500).json({message:'Server error'});
        if(result.length > 0) return res.status(400).json({message: 'User already exists'});

        const hashedPassword = await bcrypt.hash(password,10);
        const insertQuery = `INSERT INTO users (name, email,phone,password, role,balance) VALUES(?,?,?,?,'user',0.00)`;
        db.query(insertQuery, [name,email,phone,hashedPassword],(err,result)=>{
            if (err) return res.status(500).json({message: 'Error registering user'});
            return res.status(201).json({message : 'User registered successfully'});

        });
    });
   // res.json({ message: "Register endpoint hit!" });
};


exports.login= (req,res) => {
    const {email, password } = req.body;
    const query = `SELECT * FROM users WHERE email = ?`;
    db.query(query,[email], async(err,result) => {
        if(err) return res.status(500).json({message: 'Server error'});
        if(result.length === 0) return res.status(400).json({message: 'Invalid credentials'});
        
        const user = result[0];
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(400).json({message: 'Invalid Credentials'});


        const token = jwt.sign(
            { id : user.id, role: user.role },
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );

        res.status(200).json({
            message: 'Login Successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                balance: user.balance
            }
        })
    });
}