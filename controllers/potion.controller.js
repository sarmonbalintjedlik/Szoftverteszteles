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

// POST + PUT + PATCH
exports.createPotion = async (req, res, next) => {
    try {
        if (!req.body || !req.body.name) {
            return res.status(400).json({ message: 'A név kötelező' })
        }
        const created = await PotionModel.create(req.body)
        res.status(201).json(created)
    } catch (err) {
        next(err)
    }
}

exports.updatePotion = async (req, res, next) => {   // PUT
    try {
        if (!req.body || !req.body.name) {
            return res.status(400).json({ message: 'A név kötelező' })
        }
        const updated = await PotionModel.findByIdAndUpdate(
            req.params.potionId, req.body, { new: true }
        )
        if (updated) {
            res.status(200).json(updated)
        } else {
            res.status(404).send()
        }
    } catch (err) {
        next(err)
    }
}

exports.patchPotion = async (req, res, next) => {    // PATCH
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: 'Üres módosítás' })
        }
        const patched = await PotionModel.findByIdAndUpdate(
            req.params.potionId, req.body, { new: true }
        )
        if (patched) {
            res.status(200).json(patched)
        } else {
            res.status(404).send()
        }
    } catch (err) {
        next(err)
    }
}
