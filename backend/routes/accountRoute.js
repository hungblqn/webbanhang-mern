import express from 'express';
import { Account } from '../models/accountModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {verifyEmail, resetPassword} from '../utils/sendEmail.js';

const router = express.Router();

//generate random string
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        result += characters.charAt(randomIndex);
    }

    return result;
}

//verify account
const verifyAdmin = (request, response, next) => {
    // Lấy token từ cookie
    const token = request.cookies.token;
    // Kiểm tra xem token có tồn tại không
    if (!token) {
        // Nếu không có token, trả về thông báo lỗi
        return response.json("Token is missing");
    }
    else {
        jwt.verify(token, "jwt-secret-key", (error, decoded) => {
            if (error) {
                return response.json("Error with token");
            }
            else {
                if (decoded.role === "admin") {
                    next();
                }
                else {
                    return response.json("not admin");
                }
            }
        });
    }
}


const verifyUser = (request, response, next) => {
    const token = request.cookies.token;
    if (!token) {
        return response.json("Token is missing");
    }
    else {
        jwt.verify(token, "jwt-secret-key", (error, decoded) => {
            if (error) {
                return response.json("Error with token");
            }
            else {
                //logged
                if (decoded.role !== "") {
                    request.decoded = decoded;
                    next();

                }
                //not logged
                else {
                    return response.json("not login");
                }
            }
        });
    }
}

router.get('/home', verifyUser, (request, response) => {
    // Access decoded information from the request object
    const decoded = request.decoded;
    response.json({ message: "Success", decoded });
})

router.get('/dashboard', verifyAdmin, (request, response) => {
    response.json("Success");
})

router.post('/logout', (request, response) => {
    response.clearCookie('token');
    response.json({ message: 'User logged out' });
})

//get all account
router.get('/', async (request, response) => {
    try {
        const accounts = await Account.find({});
        return response.status(200).json({
            count: accounts.length,
            data: accounts
        });
    }
    catch (error) {
        console.log(error.message);
        return response.status(500).send({ message: error.message });
    }
});

//get account by id
router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const account = await Account.findById(id);
        return response.status(200).json(account);
    }
    catch (error) {
        console.log(error.message);
        return response.status(500).send({ message: error.message });
    }
});
//login
router.post('/login', async (request, response) => {
    try {
        if (!request.body.username || !request.body.password) {
            return response.status(400).send({
                message: 'Send all required fields: username, password'
            });
        }
        const { username, password } = request.body;
        const result = await Account.findOne({ username: username });
        if (!result) return response.status(234).json({ message: "Account not found" })
        // Compare hashed passwords
        const isPasswordValid = await bcrypt.compare(password, result.password);
        const verified = result.verified;
        if(verified === false){
            return response.status(234).json({ message: "Account is not verified" });
        }
        if (isPasswordValid) {
            const token = jwt.sign({ id: result._id, username: result.username, role: result.role, verified: result.verified },
                "jwt-secret-key", { expiresIn: '1d' }
            );
            // Gửi JWT dưới dạng cookie về client
            response.cookie('token', token);
            return response.json({ Status: "Success", role: result.role });
        } else {
            response.json(`Password is incorrect`);
        }
    }
    catch (error) {
        console.log(error.message);
        response.status(500).send("{message: error.message}");
    }
});

//register
router.post('/', async (request, response) => {
    try {
        if (!request.body.username || !request.body.email || !request.body.password) {
            return response.status(400).send({
                message: 'Send all required fields: username,email, password'
            });
        }
        
        const username = request.body.username;
        // Check if an account with the provided email already exists
        const existingAccount2 = await Account.findOne({ username });
        if (existingAccount2) {
            return response.status(234).send({
                message: 'Username is already in use.'
            });
        }
        const email = request.body.email
        // Check if an account with the provided email already exists
        const existingAccount = await Account.findOne({ email });

        if (existingAccount) {
            return response.status(234).send({
                message: 'Email is already in use.'
            });
        }
        

        if (existingAccount) {
            return response.status(234).send({
                message: 'Email is already in use.'
            });
        }

        // Hash the password asynchronously
        const hashedPassword = await bcrypt.hash(request.body.password, 10);
        const code = generateRandomString(20)
        const newAccount = {
            username: request.body.username,
            email: request.body.email,
            password: hashedPassword,
            verificationCode: code
        };
        const account = await Account.create(newAccount);
        const link = `http://localhost:5555/accounts/verify/${code}`
        verifyEmail(request.body.email,"Xác thực tài khoản của bạn",link )

        return response.status(201).send(account);
    }
    catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});
//Verify code (account)
router.get('/verify/:code', async (request,response) => {
    try{
        const { code } = request.params;
        if (!code) {
            return response.status(400).send({
                message: 'Verification code is required.'
            });
        }
        // Find the account with the verification code
        const account = await Account.findOne({ verificationCode: code });
        if (!account) {
            return response.status(404).send({
                message: 'Invalid verification code.'
            });
        }
        // Update the account to mark it as verified
        account.verified = true;
        account.verificationCode = generateRandomString(20);
        const updatedAccount = await account.save();
        // Redirect to the desired URL
        response.redirect('http://localhost:5173/login');
    }
    catch(error){
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
})

//Account recovery post request
router.post('/recovery', async (request, response) => {
    try{
        if (!request.body.email) {
            return response.status(400).send({
                message: 'Please send email to recovery'
            });
        }
        const account = await Account.findOne({ email: request.body.email });
        if(!account){
            return response.status(234).send({
                message: "Account doesn't exist"
            });
        }
        
        const code = generateRandomString(20)
        account.verificationCode = code
        await account.save();

        const link = `http://localhost:5173/reset-password/${code}`
        await resetPassword(request.body.email,"Yêu cầu đặt lại mật khẩu",link )

        return response.status(201).send(account);
    }
    catch(error){
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
})
//Verify account recovery
router.post('/recovery/:code', async (request,response) => {
    try{
        const { code } = request.params
        const account = await Account.findOne({ verificationCode: code});
        if(!account){
            return response.status(404).json({ message: "Account not found" });
        }
        const newPassword = await bcrypt.hash(request.body.password, 10);
        account.password = newPassword;
        const newCode = generateRandomString(20)
        account.verificationCode = newCode
        await account.save();
        return response.status(200).send({ message: "Account updated successfully" });
    }
    catch(error){
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
})

//Router for Update an account
router.put('/:id', async (request, response) => {
    try {
        if (!request.body.username || !request.body.password || !request.body.role) {
            return response.status(400).send({
                message: 'Send all required fields: username,password,role'
            });
        }
        const { id } = request.params;
        const hashedPassword = await bcrypt.hash(request.body.password, 10);
        const newAccount = {
            username: request.body.username,
            password: hashedPassword,
            role: request.body.role,
            verified: request.body.verified
        };
        const result = await Account.findByIdAndUpdate(id, newAccount);

        if (!result) return response.status(404).json({ message: "Account not found" });
        return response.status(200).send({ message: "Account updated successfully" });
    }
    catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

//Router for Delete an account
router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const result = await Account.findByIdAndDelete(id);

        if (!result) return response.status(404).json({ message: "Account not found" });
        return response.status(200).send({ message: "Account deleted successfully" });
    }
    catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Router for change password
router.post('/change-password', async (request, response) => {
    try {
        if (!request.body.accountId || !request.body.oldPassword || !request.body.newPassword) {
            return response.status(400).send({
                message: 'Send all required fields: accountId, old password, new password'
            });
        }
        const oldPassword = request.body.oldPassword;
        const existAccount = await Account.findOne({ _id: request.body.accountId });

        if (existAccount) {
            console.log("Account exists");
            const isOldPasswordMatch = await bcrypt.compare(oldPassword, existAccount.password);

            if (isOldPasswordMatch) {
                // Passwords match, you can proceed with updating the password
                const hashedNewPassword = await bcrypt.hash(request.body.newPassword, 10);
                existAccount.password = hashedNewPassword;
                await existAccount.save();

                console.log("Password updated successfully");
                return response.status(200).send({
                    message: 'Password updated successfully'
                });
            } else {
                // Old password does not match
                console.log("Old password is incorrect");
                return response.status(234).send({
                    message: 'Old password is incorrect'
                });
            }
        } else {
            console.log("Account doesn't exist");
            return response.status(404).send({
                message: 'Account not found'
            });
        }
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});



export default router;