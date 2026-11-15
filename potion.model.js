let potions = [
    { id: 1, name: 'Gyógyital', price: 50, effect: 'Visszaad 50 életpontot' },
    { id: 2, name: 'Láthatatlanság itala', price: 200, effect: 'Egy óráig láthatatlan leszel' }
]
let nextId = 3

exports.find = async () => potions

exports.findById = async (id) =>
    potions.find(p => p.id === Number(id)) || null

exports.create = async (data) => {
    const potion = { id: nextId++, ...data }
    potions.push(potion)
    return potion
}

exports.findByIdAndUpdate = async (id, data) => {
    const index = potions.findIndex(p => p.id === Number(id))
    if (index === -1) return null
    potions[index] = { ...potions[index], ...data, id: potions[index].id }
    return potions[index]
}

exports.findByIdAndDelete = async (id) => {
    const index = potions.findIndex(p => p.id === Number(id))
    if (index === -1) return null
    return potions.splice(index, 1)[0]
}