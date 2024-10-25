import mongoose, {Document, Schema} from "mongoose";




interface IDealer  {
    orderCode: number;
    responsibleStructure: string
}


const schema: Schema = new mongoose.Schema<IDealer>({
    orderCode: { type: Number, required: true },
    responsibleStructure: { type: String, required: true }
})



const Dealer = mongoose.model<IDealer & Document>('Dealer', schema)

export default Dealer;