import mongoose, { Schema } from 'mongoose';


export interface ISupervisor  {
    cpf: string | null;
    responsibleStructure: string | null,
}


const supervisorSchema = new Schema<ISupervisor>({
    cpf: { type: String, required: true },  // Se cpf for obrigatório
    responsibleStructure: { type: String, default: null },
});



const Supervisor = mongoose.model('Supervisor', supervisorSchema);
export default Supervisor;
