import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';

export const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decorder = jwt.verify(token, process.env.SECRET);
        const user = await User.findOne({_id: decorder._id, 'tokens.token': token});
        if (!user) {
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).send('Please authenticate.');
    }
}
