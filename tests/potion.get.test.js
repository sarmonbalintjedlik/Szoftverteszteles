const PotionController = require('../controllers/potion.controller')
const PotionModel = require('../models/potion.model')

jest.mock('../models/potion.model')

let req, res, next

beforeEach(() => {
    req = { params: {}, body: {} }
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn()
    }
    next = jest.fn()
    jest.clearAllMocks()
})

describe('PotionController.getPotions', () => {
    const potions = [
        { id: 1, name: 'Gyógyital', price: 50 },
        { id: 2, name: 'Láthatatlanság itala', price: 200 }
    ]

    it('létezik a getPotions függvény', () => {
        expect(typeof PotionController.getPotions).toBe('function')
    })

    it('a PotionModel.find({}) függvényt hívja meg', async () => {
        PotionModel.find.mockResolvedValue(potions)
        await PotionController.getPotions(req, res, next)
        expect(PotionModel.find).toHaveBeenCalledWith({})
    })

    it('200-as státuszkódot ad vissza', async () => {
        PotionModel.find.mockResolvedValue(potions)
        await PotionController.getPotions(req, res, next)
        expect(res.status).toHaveBeenCalledWith(200)
    })

    it('JSON-ban visszaadja az összes italt', async () => {
        PotionModel.find.mockResolvedValue(potions)
        await PotionController.getPotions(req, res, next)
        expect(res.json).toHaveBeenCalledWith(potions)
    })

    it('üres tömböt ad vissza, ha üres a bolt', async () => {
        PotionModel.find.mockResolvedValue([])
        await PotionController.getPotions(req, res, next)
        expect(res.json).toHaveBeenCalledWith([])
    })

    it('hibánál next()-tel továbbítja a hibát', async () => {
        const error = new Error('Az adatbázis nem elérhető')
        PotionModel.find.mockRejectedValue(error)
        await PotionController.getPotions(req, res, next)
        expect(next).toHaveBeenCalledWith(error)
        expect(res.json).not.toHaveBeenCalled()
    })
})

describe('PotionController.getPotionById', () => {
    const potion = { id: 1, name: 'Gyógyital', price: 50 }

    beforeEach(() => {
        req.params.potionId = '1'
    })

    it('létezik a getPotionById függvény', () => {
        expect(typeof PotionController.getPotionById).toBe('function')
    })

    it('az útvonal-paraméterrel hívja a PotionModel.findById függvényt', async () => {
        PotionModel.findById.mockResolvedValue(potion)
        await PotionController.getPotionById(req, res, next)
        expect(PotionModel.findById).toHaveBeenCalledWith('1')
    })

    it('200-at ad vissza, és JSON-ban visszaadja az italt', async () => {
        PotionModel.findById.mockResolvedValue(potion)
        await PotionController.getPotionById(req, res, next)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(potion)
    })

    it('404-et ad vissza, ha nem létezik az ital', async () => {
        PotionModel.findById.mockResolvedValue(null)
        await PotionController.getPotionById(req, res, next)
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.send).toHaveBeenCalled()
    })

    it('nem küld JSON-t, ha nem létezik az ital', async () => {
        PotionModel.findById.mockResolvedValue(null)
        await PotionController.getPotionById(req, res, next)
        expect(res.json).not.toHaveBeenCalled()
    })

    it('hibánál next()-tel továbbítja a hibát', async () => {
        const error = new Error('Az adatbázis nem elérhető')
        PotionModel.findById.mockRejectedValue(error)
        await PotionController.getPotionById(req, res, next)
        expect(next).toHaveBeenCalledWith(error)
    })
})
