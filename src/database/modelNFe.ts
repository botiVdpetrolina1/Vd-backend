




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
              emit: Array<{
                  xNome: Array<string>;
                  CNPJ: Array<string>;
                  enderEmit: Array<{
                      xLgr: Array<string>;
                      nro: Array<string>;
                      xBairro: Array<string>;
                      cMun: Array<string>;
                      xMun: Array<string>;
                      UF: Array<string>;
                      CEP: Array<string>;
                      cPais: Array<string>;
                      xPais: Array<string>;
                      fone: Array<string>;
                  }>;
                  IE: Array<string>;
                  CRT: Array<string>;
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
    }>,
  verified: boolean,
  createdAt: Date,
  verifiedAt: Date,
  table: number | null,
  orderCode: number,
  emit: {
      name: string,
      cnpj: string,
      enderEmit: {
          Lgr: string,
          nro: string,
          bairro: string,
          cMun: string,
          xMun: string,
          uF: string,
          cep: string,
          cPais: string,
          xPais: string,
          fone: string,
      },
      IE: string,
      CRT: string,
  }
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
  table: { type: Number },
  orderCode: { type: Number, ref: 'Dealer' },
  emit: {
    name: { type: String, required: true },
    cnpj: { type: String, required: true },
    enderEmit: {
        Lgr: { type: String, required: true },
        nro: { type: String, required: true },
        bairro: { type: String, required: true },
        cMun: { type: String, required: true },
        xMun: { type: String, required: true },
        uF: { type: String, required: true },
        cep: { type: String, required: true },
        cPais: { type: String, required: true },
        xPais: { type: String, required: true },
        fone: { type: String, required: true },
    },
    IE: { type: String, required: true },
    CRT: { type: String, required: true },
  }
},  { suppressReservedKeysWarning: true }
);


const NFe = mongoose.model<INFe & Document>('NFe', nfeSchema)

export default NFe;