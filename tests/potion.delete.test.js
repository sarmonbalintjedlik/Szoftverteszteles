const PotionController = require('../controllers/potion.controller')
const PotionModel = require('../models/potion.model')

jest.mock('../models/potion.model')

let req, res, next

beforeEach(() => {
    req = { params: { potionId: '1' }, body: {} }
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn()
    }
    next = jest.fn()
    jest.clearAllMocks()
})

describe('PotionController.deletePotion', () => {
    const deleted = { id: 1, name: 'Gyógyital', price: 50 }

    it('létezik a deletePotion függvény', () => {
        expect(typeof PotionController.deletePotion).toBe('function')
    })

    it('az útvonal-paraméterrel hívja a PotionModel.findByIdAndDelete függvényt', async () => {
        PotionModel.findByIdAndDelete.mockResolvedValue(deleted)
        await PotionController.deletePotion(req, res, next)
        expect(PotionModel.findByIdAndDelete).toHaveBeenCalledWith('1')
        expect(PotionModel.findByIdAndDelete).toHaveBeenCalledTimes(1)
    })

    it('200-as státuszkódot ad vissza', async () => {
        PotionModel.findByIdAndDelete.mockResolvedValue(deleted)
        await PotionController.deletePotion(req, res, next)
        expect(res.status).toHaveBeenCalledWith(200)
    })

    it('JSON-ban visszaadja a törölt italt', async () => {
        PotionModel.findByIdAndDelete.mockResolvedValue(deleted)
        await PotionController.deletePotion(req, res, next)
        expect(res.json).toHaveBeenCalledWith(deleted)
    })

    it('404-et ad vissza, ha nem létezik az ital', async () => {
        PotionModel.findByIdAndDelete.mockResolvedValue(null)
        await PotionController.deletePotion(req, res, next)
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.send).toHaveBeenCalled()
    })

    it('hibánál next()-tel továbbítja a hibát', async () => {
        const error = new Error('Az adatbázis nem elérhető')
        PotionModel.findByIdAndDelete.mockRejectedValue(error)
        await PotionController.deletePotion(req, res, next)
        expect(next).toHaveBeenCalledWith(error)
    })
})
