const router = require("express").Router();
const AuthService = require("../Service/service");
const AuthMiddlewares = require("../middlewares/authMiddlewares");




class AuthController {
    constructor() {
        this.authService = new AuthService();
    }

    async login(req, res) {
        const { email, password } = req.body;

        const result = await this.authService.loginUser(email, password);

        if (result.success) {
            res.json({ message: result.message,token: result.token });
        } else {
            res.status(400).json({ message: result.message });
        }
    }

    async register(req, res) {
        const user = req.body;

        try {
            const existingUserEmail = await this.authService.existingUserEmail(user.email);
            const existingUserName = await this.authService.existingUserName(user.username);

            if (existingUserEmail) {
                throw new Error("Email already taken");
            }

            if (existingUserName) {
                throw new Error("Username already taken");
            }

            const result = await this.authService.registerUser(user);
            res.json(result);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    async getProfile(req, res) {
        try {
            // Call the isAuthenticated middleware
            await AuthMiddlewares.isAuthenticated(req, res, async () => {
                const userId = req.decodedUserId;
                const user = await this.authService.getUserById(userId);
                res.json(user);
            });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
    

    async getAll(req, res) {
        try {
            const users = await this.authService.getAllUsers();
            res.json(users);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }   


    async setcookie(req,res){
        try{
            const userToken = req.headers.authorization;
            res.setHeader('Set-Cookie', `token=${userToken}; Path=/; HttpOnly; Max-Age=3600`);
            res.send('got a cookie');
        }catch(err){
            res.status(400).json({ message: err.message });
        }
    }

    getRouter() {
        return router
            .post("/login", this.login.bind(this))
            .post("/register", this.register.bind(this))
            .get("/profile", this.getProfile.bind(this))
            .get("/all", this.getAll.bind(this));

    }
}








/* 
const validate = (data) => {
    const schema = Joi.object({
        username: Joi.string().required().label("UserName"),
        firstname: Joi.string().required().label("First Name"),
        lastname: Joi.string().required().label("Last Name"),
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    });

    return schema.validate(data);
};

router.post("/register", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        } else {
            const user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(409).send({ message: "Email already registered" });
            }
            const salt = await bcrypt.genSalt(Number(process.env.SALT));
            const hashPassword = await bcrypt.hash(req.body.password, salt);

            await new User({ ...req.body, password: hashPassword }).save();
            res.status(201).send({ message: "User created successfully" });
        }
    } catch (error) {
        res.status(500).send({ message: `Internal server error${error}` });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        } else {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(401).send({ message: "Invalid Email or Password" });
            }
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) {
                return res.status(401).send({ message: "Invalid Email or Password" });
            }
        }
    } catch (error) {
        res.status(500).send({ message: `Internal server error${error}` });
    }
});

router.get("/getall", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
}); */





module.exports = AuthController;
