const User = require('../models/User')
const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')
//helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')


module.exports = class UserController {
    static async register(req, res) {
        const { name, email, phone, password, confirmpassword } = req.body

        /* validations */
        if (!name) {
            res.status(422).json({ message: 'o nome é obrigatório' })
            return
        }
        if (!email) {
            res.status(422).json({ message: 'o email é obrigatório' })
            return
        }
        if (!phone) {
            res.status(422).json({ message: 'o telefone é obrigatório' })
            return
        }
        if (!password) {
            res.status(422).json({ message: 'a senha é obrigatória' })
            return
        }
        if (!confirmpassword) {
            res.status(422).json({ message: 'a confirmação de senha é obrigatória' })
            return
        }
        if (password !== confirmpassword) {
            res
                .status(422)
                .json({
                    message: 'as senhas n conincidem'
                })
            return
        }
        /* check if user exists */

        const userExists = await User.findOne({ email: email })
        if (userExists) {
            res
                .status(422)
                .json({
                    message: 'por favor utilize outro e-mail!',
                })
            return
        }

        /* create a password */
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        /* create a user */
        const user = new User({
            name,
            email,
            phone,
            password: passwordHash,

        })
        try {
            const newUser = await user.save()
            await createUserToken(newUser, req, res)

        } catch (error) {
            res.status(500).json({ message: error })

        }
    }
    /* função de login */
    static async login(req, res) {
        const { email, password } = req.body
        if (!email) {
            res.status(422).json({ message: 'o e-mail é obrigatório' })
        }
        if (!password) {
            res.status(422).json({ message: 'a senha  é obrigatória' })
            return
        }
        /* check if user exists */

        const user = await User.findOne({ email: email })
        if (!user) {
            res
                .status(422)
                .json({
                    message: 'usuário inexistente!',
                })
            return
        }
        /* validando a senha */
        const checkPassword = await bcrypt.compare(password, user.password)
        if (!checkPassword) {
            res.status(422).json({ message: "senha incorreta" })
            return
        }

        await createUserToken(user, req, res)

    }
    /* verificando usuário pelo token */
    static async checkUser(req, res) {
        let currrentUser



        if (req.headers.authorization) {
            const token = getToken(req)
            const decoded = jwt.verify(token, 'nossosecret')
            currrentUser = await User.findById(decoded.id)
            currrentUser.password = undefined

        } else {
            currrentUser = null
        }
        res.status(200).send(currrentUser)
    }
    static async GetUserById(req, res) {
        const id = req.params.id

        const user = await User.findById(id).select("-password")

        if (!user) {
            res.status(422).json({
                message: "usuário não encontrado!",
            })
            return
        }
        res.status(200).json({ user })
    }
    static async editUser(req, res) {

        //check user exists
        const token = getToken(req)
        const user = await getUserByToken(token)

        const { name, email, phone, password, confirmpassword } = req.body

        if(req.file){
           user.image = req.file.filename
        }

        //validations
        if (!name) {
            res.status(422).json({ message: 'o nome é obrigatório' })
            return
        }
        user.name = name
        if (!email) {
            res.status(422).json({ message: 'o email é obrigatório' })
            return
        }
        //check if email has alread taken
        const userExists = await User.findOne({ email: email })
        if (user.email !== email && userExists) {
            res.status(422).json({
                message: "por favor utlize outro email!",
            })
            return
        }

        user.email = email

        if (!phone) {
            res.status(422).json({ message: 'o telefone é obrigatório' })
            return
        }

        user.phone = phone

        if (password != confirmpassword) {
            res.status(422).json({ message: 'as senhas não conferem' })
            return



        } else if (password === confirmpassword && password != null) {
            const salt = await bcrypt.genSalt(12)
            const reqPassword = req.body.password
            const passwordHash = await bcrypt.hash(reqPassword, salt)

            user.password = passwordHash
        }
        try {
             await User.findOneAndUpdate(
                { _id:user._id },
                { $set: user },
                { new: true },
            )
            res.status(200).json({ message: 'usuário atualizado com sucesso!' })
        } catch (err) {
            res.status(500).json({ message: err })

        }

    }

}