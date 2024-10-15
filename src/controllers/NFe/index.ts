


import * as createNFe from './createNFe'
import * as updateNFe from './updateNFe'
import * as getNFeById from './getNFeById'



export const NfeController = {
    ...createNFe,
    ...updateNFe,
    ...getNFeById
}