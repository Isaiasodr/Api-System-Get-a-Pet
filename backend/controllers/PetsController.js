const Pet = require('../models/Pet')

/* helpers */
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')



module.exports = class PetController {
    static async create(req, res) {
        const { name, age, weight, color } = req.body
        const available = true

        //upload de imagens

        //validation
        if (!name) {
            res.status(422).json({ message: 'o nome do pet é obrigatório' })
            return
        }
        if (!age) {
            res.status(422).json({ message: 'a idade  do pet é obrigatório' })
            return
        }
        if (!weight) {
            res.status(422).json({ message: 'o peso do pet é obrigatório' })
            return
        }
        if (!color) {
            res.status(422).json({ message: 'a cor do pet é obrigatório' })
            return
        }
        /* get pet owner */
       const token = getToken(req)
       const user = await getUserByToken(token)
        /* create a pet */
        const pet = new Pet({
            name,
            age,
            weight,
            color,
            available,
            images:[],
            user:{
                _id:user._id,
                name:user.name,
                image:user.image,
                phone:user.phone,
            },
        })
        try {
            const newPet = await pet.save()
            res.status(201).json({message:"pet cadastrado com sucesso",newPet})
        } catch (error) {
            res.status(500).json({message:error})
            console.log(error)
        }
    }

}