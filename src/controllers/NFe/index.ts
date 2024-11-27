


import * as createNFe from './createNFe'
import * as updateNFe from './updateNFe'
import * as getNFeById from './getNFeById'
import * as getAllNFe from './getAllNFe'
import * as getAllNFeNoOrder from './getAllNFeNoOrder'



export const NfeController = {
    ...createNFe,
    ...updateNFe,
    ...getNFeById,
    ...getAllNFe,
    ...getAllNFeNoOrder,
}