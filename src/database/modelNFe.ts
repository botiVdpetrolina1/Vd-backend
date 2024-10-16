




import mongoose, {Document, Schema} from "mongoose";


export interface NFeJson {
  nfeProc: {
      NFe: Array<{
          infNFe: Array<{
              $: {
                  Id: string;
                  versao: string;
              };
              autXML?: Array<{ CPF?: Array<string> }>;
              det: Array<{
                  prod: Array<{
                      cEAN: Array<string>;
                      cEANTrib: Array<string>;
                      cProd: Array<string>;
                      indTot: Array<string>;
                      nItemPed?: Array<string>;
                      vProd: Array<string>;
                      vUnCom: Array<string>;
                      vUnTrib: Array<string>;
                      xPed?: Array<string>;
                      xProd: Array<string>;
                      qCom: Array<string>;
                  }>;
              }>;
          }>;
      }>;
  };
}


export interface INFe {
  codNFe: string,
  version: string,
  autXML: {
    cpf: string | null,
  },
  products: Array<{
    
      cEAN: string,
      cEANTrib: string,
      cProd: string,
      indTot: string,
      nItemPed: string | null,
      vProd: string,
      vUnCom: string,
      vUnTrib: string,
      xPed: string | null,
      xProd: string,
      qCom: string 
    }>;
    verified: boolean,
    createdAt: Date,
    verifiedAt: Date
}

const nfeSchema: Schema = new Schema<INFe>({
    codNFe: { type: String, required: true },
    version: { type: String, required: true },
    autXML: {
      cpf: { type: String, required: true },
    },
    products: [
      {
        cEAN: { type: String, required: true },
        cEANTrib: { type: String, required: true },
        cProd: { type: String, required: true },
        indTot: { type: String, required: true },
        nItemPed: { type: String, required: true },
        vProd: { type: String, required: true },
        vUnCom: { type: String, required: true },
        vUnTrib: { type: String, required: true },
        xPed: { type: String, required: true },
        xProd: { type: String, required: true },
        qCom: { type: String, required: true }
      }
    ],
    verified: { type: Boolean, required: true },
    createdAt: { type: Date, required: true },
    verifiedAt: { type: Date },
})



const NFe = mongoose.model<INFe & Document>('NFe', nfeSchema)

export default NFe;