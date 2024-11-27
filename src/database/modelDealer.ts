import mongoose, {Document, Schema} from "mongoose";




export interface IDealer  {
    orderCode: number;
    responsibleStructure: string | null,
    deliveryForecast: string | null;
    batch: string
}


const schema: Schema = new mongoose.Schema({
    orderCode: { type: Number, required: true },
    responsibleStructure: { type: String, required: false },
    deliveryForecast: { type: String, required: false },
    batch: { type: String, required: false },
})



const Dealer = mongoose.model<IDealer & Document>('Dealer', schema)

export default Dealer;