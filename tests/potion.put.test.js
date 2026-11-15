const PotionController = require('../controllers/potion.controller')
const PotionModel = require('../models/potion.model')

jest.mock('../models/potion.model')

let req, res, next
const body = { name: 'Erősebb gyógyital', price: 80, effect: 'Visszaad 100 életpontot' }

beforeEach(() => {
    req = { params: { potionId: '1' }, body: { ...body } }
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn()
    }
    next = jest.fn()
    jest.clearAllMocks()
})

describe('PotionController.updatePotion (PUT)', () => {
    it('létezik az updatePotion függvény', () => {
        expect(typeof PotionController.updatePotion).toBe('function')
    })

    it('az id-val, a body-val és a {new: true} beállítással hívja a findByIdAndUpdate függvényt', async () => {
        PotionModel.findByIdAndUpdate.mockResolvedValue({ id: 1, ...body })
        await PotionController.updatePotion(req, res, next)
        expect(PotionModel.findByIdAndUpdate).toHaveBeenCalledWith('1', body, { new: true })
    })

    it('200-at ad vissza, és JSON-ban visszaadja a módosított italt', async () => {
        const updated = { id: 1, ...body }
        PotionModel.findByIdAndUpdate.mockResolvedValue(updated)
        await PotionController.updatePotion(req, res, next)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(updated)
    })

    it('404-et ad vissza, ha nem létezik a ital', async () => {
        PotionModel.findByIdAndUpdate.mockResolvedValue(null)
        await PotionController.updatePotion(req, res, next)
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.send).toHaveBeenCalled()
    })

    it('400-at ad vissza, ha hiányzik a név', async () => {
        req.body = { price: 80 }
        await PotionController.updatePotion(req, res, next)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(PotionModel.findByIdAndUpdate).not.toHaveBeenCalled()
    })

    it('hibánál next függvénnyel továbbítja a hibát', async () => {
        const error = new Error('Az adatbázis nem elérhető')
        PotionModel.findByIdAndUpdate.mockRejectedValue(error)
        await PotionController.updatePotion(req, res, next)
        expect(next).toHaveBeenCalledWith(error)
    })
})
