const PotionModel = require('../models/potion.model')

// GET + DELETE
exports.getPotions = async (req, res, next) => {
    try {
        const potions = await PotionModel.find({})
        res.status(200).json(potions)
    } catch (err) {
        next(err)
    }
}

exports.getPotionById = async (req, res, next) => {
    try {
        const potion = await PotionModel.findById(req.params.potionId)
        if (potion) {
            res.status(200).json(potion)
        } else {
            res.status(404).send()
        }
    } catch (err) {
        next(err)
    }
}

exports.deletePotion = async (req, res, next) => {
    try {
        const deleted = await PotionModel.findByIdAndDelete(req.params.potionId)
        if (deleted) {
            res.status(200).json(deleted)
        } else {
            res.status(404).send()
        }
    } catch (err) {
        next(err)
    }
}
