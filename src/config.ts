const dotenv = require('dotenv');
const path = require('path');

console.log(path.resolve(path.join(__dirname,'config', `${process.env.NODE_ENV}.env`)))
dotenv.config({
    path: path.resolve(path.join(__dirname,'config', `${process.env.NODE_ENV}.env`))
});

export const config = {
    NODE_ENV : process.env.NODE_ENV || 'development',
    HOST : process.env.HOST || 'localhost',
    PORT : Number(process.env.PORT) || 3000
}