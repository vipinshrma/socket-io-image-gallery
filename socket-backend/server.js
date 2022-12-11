const express = require('express')
const socket = require('socket.io')
const cors = require('cors')

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(express.json());

const generateID = () => Math.random().toString(36).substring(2, 10);

const database = [
    {
        email: "vipin@gmail.com",
        username: "vipin",
        id: generateID(),
        password: "12345678",
        images: [
            {
                id: "1",
                image_url:
                    "https://images.unsplash.com/photo-1670514820829-ac2f2af3259c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=60",
                vote_count: 0,
                votedUsers: []
            },
            {
                id: "2",
                image_url:
                    "https://images.unsplash.com/photo-1670675525157-569ee8458478?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzMnx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=60",
                vote_count: 0,
                votedUsers: []
            },
        ],
    }
];

const http = require("http").Server(app);
const socketIO = socket(http, {
    cors: {
        origin: "http://localhost:3004"
    }
})

socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    socket.on('register', (data) => {
        let result = database.filter((user => user.email === data.email || user.username === data.username))
        if (result.length === 0) {
            database.push({ ...data, id: generateID(), images: [], })
            return socket.emit('registerSuccess', "Account created successfully!")
        }
        return socket.emit('registerError', "User already exists")
    })

    socket.on('loginUser', ({ username, password }) => {
        let user = database.find((user => user.username === username && user.password === password))
        if (user) {
            return socket.emit('loginSuccess', {
                message: "Login user successfully!", user: {
                    _id: user.id,
                    _email: user.email,
                }
            })
        }
        return socket.emit('loginError', "User not found")

    })

    socket.on('getImages', ({ id, email }) => {
        let images = database.reduce((acc, curr) => acc = [...acc, ...curr.images], []);
        socket.emit('getImagesSuccess', images)

    })

    socket.on('getMyImages', ({ id, email }) => {
        let user = database.find((user => user.email == email));
        if (user) {
            socket.emit('getMyImagesSuccess', { images: user.images, username: user.username })

        }

    })

    socket.on('uploadImage', ({ id, email, photoURL }) => {
        let user = database.find((user => user.email == email));
        let userIdx = database.findIndex(user => user.email === email)
        if (user) {
            let imageData = {
                image_url: photoURL,
                id: generateID(),
                vote_count: 0,
                votedUsers: []
            }
            user = {
                ...user,
                images: [...user.images, imageData]
            }
            database.splice(userIdx, 1, user)
            return socket.emit('uploadSuccess', { message: "Upload photo successfully" })
        }
        return socket.emit("uploadError", "Photo not uploaded")
    })

    socket.on('upvote', ({ photoId, email }) => {
        let user = database.find((user => user.email === email))
        // let images = database.reduce((acc, curr) => acc = [...acc, ...curr.images], []);
        let images = database.reduce((acc, curr) => {
            acc = [...acc, ...curr.images]
            return acc
        }, [])
        if (images.length > 1) {
            const item = images?.filter((image) => image.id === photoId);
            if (item?.length < 1) {
                return socket.emit("upvoteError", {
                    error_message: "You cannot upvote your photos",
                });
            }
            //👇🏻 Gets the list of voted users from the selected image
            const voters = item[0].votedUsers;
            //👇🏻 Checks if the user has not upvoted the image before
            const authenticateUpvote = voters.filter((voter) => voter === email);
            if (!authenticateUpvote.length) {
                //👇🏻 increases the vote count
                item[0].vote_count += 1;
                //👇🏻 adds the user ID to the list of voters
                voters.push(email);
                //👇🏻 triggers this event to reflect the change in vote count
                socket.emit("getImagesSuccess", images);
                //👇🏻 Returns the upvote response
                return socket.emit("upvoteSuccess", {
                    message: "Upvote successful",
                    item,
                });
            }

        }
        socket.emit("upvoteError", {
            error_message: "Duplicate votes are not allowed",
        });
    })



    socket.on('disconnect', () => {
        socket.disconnect()
        console.log('🔥: A user disconnected');
    });
})


app.get('/', (req, res) => {
    console.log("hello")
    res.status(200).send("Hello from backend")
})



http.listen(4002, () => {
    console.log("Port listening on Port 4002")
})
