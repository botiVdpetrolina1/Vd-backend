


import * as createNFe from './createNFe'
import * as updateNFe from './updateNFe'
import * as getNFeById from './getNFeById'
import * as getAllNFe from './getAllNFe'
import * as getAllNFeVerified from './getAllNFeVerified'



export const NfeController = {
    ...createNFe,
    ...updateNFe,
    ...getNFeById,
    ...getAllNFe
}