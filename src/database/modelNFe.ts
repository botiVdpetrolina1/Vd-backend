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

        dest: Array<{
          xNome: Array<string>; 
          CNPJ?: Array<string>; 
          CPF?: Array<string>; 
          enderDest: Array<{
            xLgr: Array<string>;
            nro: Array<string>;
            xBairro: Array<string>;
            cMun: Array<string>;
            xMun: Array<string>;
            UF: Array<string>;
            CEP: Array<string>;
            cPais: Array<string>;
            xPais: Array<string>;
            fone?: Array<string>; 
          }>;
          indIEDest?: Array<string>; 
          email?: Array<string>; 
        }>;
        infAdic: Array<{
          infCpl: Array<string>
        }>
      }>;
    }>;
  };
}


export interface INFe {
  _id: string;
  codNFe: string;
  version: string;
  autXML: {
    cpf: string | null;
  };
  products: Array<{
    cEAN: string;
    cEANTrib: string;
    cProd: string;
    indTot: string;
    nItemPed: string | null;
    vProd: string;
    vUnCom: string;
    vUnTrib: string;
    xPed: string | null;
    xProd: string;
    qCom: string;
  }>;
  verified: boolean;
  createdAt: Date;
  verifiedAt: Date;
  table: number | null;
  orderCode: number;
  emit: {
    name: string;
    cnpj: string;
    enderEmit: {
      Lgr: string;
      nro: string;
      bairro: string;
      cMun: string;
      xMun: string;
      uF: string;
      cep: string;
      cPais: string;
      xPais: string;
      fone: string;
    };
    IE: string;
    CRT: string;
  };
  dest: { 
    cpf?: string ;
    xNome?: string;
    enderDest: {
      Lgr?: string ;
      nro?: string | null;
      bairro?: string ;
      cMun?: string ;
      xMun?: string;
      uF?: string;
      cep?: string;
      cPais?: string ;
      xPais?: string;
      fone?: string ;
    };
    indIEDest?: string ;
    email?: string;
  };
  infAdic: {
    infCpl: string
  }
}


const nfeSchema: Schema = new Schema<INFe>({
  codNFe: { type: String, required: false },
  version: { type: String, required: false },
  autXML: {
    cpf: { type: String, required: false },
  },
  products: [
    {
      cEAN: { type: String, required: false },
      cEANTrib: { type: String, required: false },
      cProd: { type: String, required: false },
      indTot: { type: String, required: false },
      nItemPed: { type: String, required: false },
      vProd: { type: String, required: false },
      vUnCom: { type: String, required: false },
      vUnTrib: { type: String, required: false },
      xPed: { type: String, required: false },
      xProd: { type: String, required: false },
      qCom: { type: String, required: false }
    }
  ],
  verified: { type: Boolean, required: false },
  createdAt: { type: Date, required: false },
  verifiedAt: { type: Date },
  table: { type: Number },
  orderCode: { type: Number, ref: 'Dealer' },
  emit: {
    name: { type: String, required: false },
    cnpj: { type: String, required: false },
    enderEmit: {
      Lgr: { type: String, required: false },
      nro: { type: String, required: false },
      bairro: { type: String, required: false },
      cMun: { type: String, required: false },
      xMun: { type: String, required: false },
      uF: { type: String, required: false },
      cep: { type: String, required: false },
      cPais: { type: String, required: false },
      xPais: { type: String, required: false },
      fone: { type: String, required: false },
    },
    IE: { type: String, required: false },
    CRT: { type: String, required: false },
  },
  dest: {
    cpf: { type: String, required: false },
    xNome: { type: String, required: false },
    enderDest: {
      Lgr: { type: String, required: false },
      nro: { type: String, required: false },
      bairro: { type: String, required: false },
      cMun: { type: String, required: false },
      xMun: { type: String, required: false },
      uF: { type: String, required: false },
      cep: { type: String, required: false },
      cPais: { type: String, required: false },
      xPais: { type: String, required: false },
      fone: { type: String, required: false },
    },
    indIEDest: { type: String, required: false },
    email:{ type: String, required: false },
  },
  infAdic: {
    infCpl: { type: String, required: false }
  },
  
  },
  { suppressReservedKeysWarning: true }
  );



const NFe = mongoose.model<INFe & Document>('NFe', nfeSchema)

export default NFe;