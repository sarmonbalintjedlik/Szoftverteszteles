const PotionController = require('../controllers/potion.controller')
const PotionModel = require('../models/potion.model')

jest.mock('../models/potion.model')

let req, res, next

beforeEach(() => {
    req = { params: { potionId: '1' }, body: { price: 99 } }
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn()
    }
    next = jest.fn()
    jest.clearAllMocks()
})

describe('PotionController.patchPotion (PATCH)', () => {
    it('létezik a patchPotion függvény', () => {
        expect(typeof PotionController.patchPotion).toBe('function')
    })

    it('az id-val, a részleges body-val és a {new: true} beállítással hívja a findByIdAndUpdate függvényt', async () => {
        PotionModel.findByIdAndUpdate.mockResolvedValue({ id: 1, name: 'Gyógyital', price: 99 })
        await PotionController.patchPotion(req, res, next)
        expect(PotionModel.findByIdAndUpdate).toHaveBeenCalledWith('1', { price: 99 }, { new: true })
    })

    it('200-at ad vissza, és JSON-ban visszaadja a módosított italt', async () => {
        const patched = { id: 1, name: 'Gyógyital', price: 99 }
        PotionModel.findByIdAndUpdate.mockResolvedValue(patched)
        await PotionController.patchPotion(req, res, next)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(patched)
    })

    it('404-et ad vissza, ha nem létezik az ital', async () => {
        PotionModel.findByIdAndUpdate.mockResolvedValue(null)
        await PotionController.patchPotion(req, res, next)
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.send).toHaveBeenCalled()
    })

    it('400-at ad vissza, ha üres a body', async () => {
        req.body = {}
        await PotionController.patchPotion(req, res, next)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(PotionModel.findByIdAndUpdate).not.toHaveBeenCalled()
    })

    it('hibánál next()-tel továbbítja a hibát', async () => {
        const error = new Error('Az adatbázis nem elérhető')
        PotionModel.findByIdAndUpdate.mockRejectedValue(error)
        await PotionController.patchPotion(req, res, next)
        expect(next).toHaveBeenCalledWith(error)
    })
})
