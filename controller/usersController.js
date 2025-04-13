const db = require("../database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const { use } = require("../route");

const registration = async(req, res) => {
    try{
        console.log(1);
        //GET LOGIN INFO FROM USERS
        const{name, phoneNumber, email, address, password} = req.body
        console.log(2);

        //ADD VALIDATIONS 
        if(!name || !name.trim()) throw "Name is Required";
        if(!phoneNumber) throw "Phone Number is required";
        if(!email || !email.trim()) throw "Email is required";
        if(!address || !address.trim()) throw "Address is required";
        if(!password) throw "Password is required";
        console.log(3);

        const [isExist] = await db.query("SELECT * FROM USERS WHERE phone = ? OR email = ?",[phoneNumber, email])
        console.log(4,isExist);

        if (isExist.length !== 0) {
            throw "Already exist"
        }
        console.log(5);

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(6,hashedPassword);

        //STORING USER INFO TO DATABASE
        const [result] = await db.query("INSERT INTO USERS (name, phone, email, address, password) VALUES (?,?,?,?,?)",[name, phoneNumber, email, address, hashedPassword]);
        console.log(7,result);
        
        const [userDetail] = await db.query("SELECT * FROM users WHERE email = ?",[email])
        const user = userDetail[0];
        console.log(8,userDetail);

        //Creating user cart
        const [cart] = await db.query("INSERT INTO CARTS (user_id) VALUES (?)",[user.id]);

        res.json({status:200, message:"Successfully done", data:{}})

    } catch (error) {
        console.log("Something went wrong", error);
        res.json({status:400, error})
    }
}

const login = async(req, res) => {
    try {
        console.log(1);
        //GET USERNAME AND PASSWORD FROM USERS
        const {email, password} = req.body;
        console.log(2,email,password);

        //VALIDATION
        if(!email || !email.trim()) throw "Email is Required";
        if(!password) throw "Password is required"
        console.log(3);

        const[result] = await db.query("SELECT * FROM USERS WHERE email = ?",[email]);
        console.log(4,result);

        if (result.length === 0) return res.status(400).json({ message: "Invalid Email" });
        console.log(5);

        const user = result[0];
        console.log(6,user);

        // // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(7,isMatch);
        if (!isMatch) return res.status(400).json({ message: "Invalid Email/Password" });
        console.log(8)

        // // Generate JWT token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "30d" });
        console.log(9,token);
        delete user.password;

        res.json({status:200, message:"Login successfully", data:{...user,token}})

    } catch (error) {
        console.log("Something went wrong", error);
        res.json({status:400, error})
    }
}

module.exports = {
    registration, login, 
}