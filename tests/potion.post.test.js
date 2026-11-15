const PotionController = require('../controllers/potion.controller')
const PotionModel = require('../models/potion.model')

jest.mock('../models/potion.model')

let req, res, next
const newPotion = { name: 'Tűzálló ital', price: 120, effect: 'Védelem a tűz ellen' }

beforeEach(() => {
    req = { params: {}, body: { ...newPotion } }
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn()
    }
    next = jest.fn()
    jest.clearAllMocks()
})

describe('PotionController.createPotion', () => {
    it('létezik a createPotion függvény', () => {
        expect(typeof PotionController.createPotion).toBe('function')
    })

    it('a req.body-val hívja a PotionModel.create függvényt', async () => {
        PotionModel.create.mockResolvedValue({ id: 3, ...newPotion })
        await PotionController.createPotion(req, res, next)
        expect(PotionModel.create).toHaveBeenCalledWith(newPotion)
    })

    it('201-es státuszkódot ad vissza', async () => {
        PotionModel.create.mockResolvedValue({ id: 3, ...newPotion })
        await PotionController.createPotion(req, res, next)
        expect(res.status).toHaveBeenCalledWith(201)
    })

    it('JSON-ban visszaadja a létrehozott italt', async () => {
        const created = { id: 3, ...newPotion }
        PotionModel.create.mockResolvedValue(created)
        await PotionController.createPotion(req, res, next)
        expect(res.json).toHaveBeenCalledWith(created)
    })

    it('400-at ad vissza, ha hiányzik a név', async () => {
        req.body = { price: 10 }
        await PotionController.createPotion(req, res, next)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(PotionModel.create).not.toHaveBeenCalled()
    })

    it('hibánál next()-tel továbbítja a hibát', async () => {
        const error = new Error('Az adatbázis nem elérhető')
        PotionModel.create.mockRejectedValue(error)
        await PotionController.createPotion(req, res, next)
        expect(next).toHaveBeenCalledWith(error)
    })
})
