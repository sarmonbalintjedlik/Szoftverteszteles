const express = require('express')

const PotionController = require('./controllers/potion.controller')

const app = express()

app.use(express.json())

app.get('/potions', PotionController.getPotions)
app.get('/potions/:potionId', PotionController.getPotionById)
app.post('/potions', PotionController.createPotion)
app.put('/potions/:potionId', PotionController.updatePotion)
app.patch('/potions/:potionId', PotionController.patchPotion)
app.delete('/potions/:potionId', PotionController.deletePotion)

app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message })
})

app.listen(3000, () => console.log('A varázsitalbolt nyitva van: http://localhost:3000/potions'))