class RecordConnection {
  public recordDB: Record[] = [
    { 
      id: 1, type: 'health prescription', date: new Date(2020, 2, 27), 
      illness: 'Type 1 Diabetes', clinicalOpinion: 'Rest More and Take Medication on Time'
    },
    { 
      id: 2, type: 'health prescription', date: new Date(2020, 2, 27), 
      illness: 'Asthma', clinicalOpinion: 'Rest More and Take Medication on Time'
    },
    { 
      id: 3, type: 'health prescription', date: new Date(2020, 2, 28), appID: 8, 
      illness: 'Sore Throat', clinicalOpinion: 'Rest More and Take Medication on Time'
    },
    { 
      id: 4, type: 'medication record', date: new Date(2020, 2, 27), prescriptionID: 1,
      medications: [
        { medicine: 'Acetaminophen (Tylenol)', dosage: 10, usage: '2mL' },
        { medicine: 'Ibuprofen (Advil, Motrin)', dosage: 15, usage: '3mL' },
        { medicine: 'Aspirin', dosage: 10, usage: '2mL' }
      ]
    },
    { 
      id: 5, type: 'medication record', date: new Date(2020, 2, 27), prescriptionID: 2,
      medications: [
        { medicine: 'Acetaminophen (Tylenol)', dosage: 10, usage: '2mL' },
        { medicine: 'Ibuprofen (Advil, Motrin)', dosage: 15, usage: '3mL' },
        { medicine: 'Aspirin', dosage: 10, usage: '2mL' }
      ]
    },
    { 
      id: 6, type: 'medication record', date: new Date(2020, 2, 28), prescriptionID: 2,
      medications: [
        { medicine: 'Acetaminophen (Tylenol)', dosage: 10, usage: '2mL' },
        { medicine: 'Ibuprofen (Advil, Motrin)', dosage: 15, usage: '3mL' },
        { medicine: 'Aspirin', dosage: 10, usage: '2mL' }
      ]
    },
    { 
      id: 7, type: 'medication record', date: new Date(2020, 2, 28), prescriptionID: 3,
      medications: [
        { medicine: 'Acetaminophen (Tylenol)', dosage: 10, usage: '2mL' },
        { medicine: 'Ibuprofen (Advil, Motrin)', dosage: 15, usage: '3mL' },
        { medicine: 'Aspirin', dosage: 10, usage: '2mL' }
      ]
    },
    { 
      id: 8, type: 'medication record', date: new Date(2020, 2, 30), prescriptionID: 3,
      medications: [
        { medicine: 'Acetaminophen (Tylenol)', dosage: 10, usage: '2mL' },
        { medicine: 'Ibuprofen (Advil, Motrin)', dosage: 15, usage: '3mL' },
        { medicine: 'Aspirin', dosage: 10, usage: '2mL' }
      ]
    },
    { 
      id: 9, type: 'lab test result', date: new Date(2020, 2, 30), appID: 4, comment: 'Time to work out more', title: 'Urine Test',
      data: [ 
        {field: 'Epinephrine', result: '60', normalRange: '0 - 20' },
        {field: 'Metanephrine', result: '3,232', normalRange: '0 - 1,000' },
        {field: 'Norepinephrine', result: '63.4', normalRange: '15 - 80' },
        {field: 'Normepinephrine', result: '373', normalRange: '109 - 500' },
        {field: 'Dopamine', result: '222', normalRange: '65 - 400' }
      ] 
    },
    { id: 10, type: 'lab test result', date: new Date(2020, 2, 30), appID: 9, comment: 'Time to work out more and have more rest', title: 'Blood Test',
      data: [ 
        {field: 'White Blood Cells', result: '1,400', normalRange: '4,000 - 11,000' }, 
        {field: 'Neutrophils', result: '800', normalRange: '1,500 - 5,000' }, 
        {field: 'Red Blood Cells', result: '2,100,000', normalRange: '4,500,000 - 6,500,000' }, 
        {field: 'Heamoglobin', result: '7.1g/dl', normalRange: '13 - 18' }, 
        {field: 'Hematocrit', result: '20%', normalRange: '40 - 54' }
      ] 
    },
    { 
      id: 11, type: 'health prescription', date: new Date(2020, 3, 16), appID: 9, 
      illness: 'Sore Throat', clinicalOpinion: 'Rest More and Take Medication on Time'
    },
    { 
      id: 12, type: 'medication record', date: new Date(2020, 3, 16), prescriptionID: 11,
      medications: [
        { medicine: 'Acetaminophen (Tylenol)', dosage: 10, usage: '2mL' },
        { medicine: 'Ibuprofen (Advil, Motrin)', dosage: 15, usage: '3mL' },
        { medicine: 'Aspirin', dosage: 10, usage: '2mL' }
      ]
    },
    { 
      id: 13, type: 'medication record', date: new Date(2020, 3, 20), prescriptionID: 11,
      medications: [
        { medicine: 'Acetaminophen (Tylenol)', dosage: 10, usage: '2mL' },
        { medicine: 'Ibuprofen (Advil, Motrin)', dosage: 15, usage: '3mL' },
        { medicine: 'Tuns', dosage: 15, usage: '3mL' },
        { medicine: 'Cimetidine (Tagamet HB', dosage: 30, usage: '5mL' },
        { medicine: 'Iansoprazole (Prevacid 24)', dosage: 25, usage: '5mL' }
      ]
    }
  ]

  public allRecords = (): { type: string, data: { id: number, date: Date }[] }[] => {
    const temp = this.recordDB.filter(a => a.type !== 'medication record').reduce((a, b) =>  
      a[b.type]?.length > 0
      ? {...a, [b.type]: [...a[b.type], {...b}]}
      : {...a, [b.type]: [{...b}]}
      , {}
    )
    return Object.keys(temp).map(k => ({ type: k, data: temp[k] }))
  }
  public allMedicationRecords = (): Record[] => this.recordDB.filter(r => r.type === 'medication record')

  public getRecord = (id: number): Record => this.recordDB.find(r => r.id === id)
  public getMedicationRecords = (preID: number): Record[] => this.recordDB.filter(r => isMedicationRecord(r) && r.prescriptionID === preID)
}

export default new RecordConnection()

export type Record = HealthPrescription | MedicationRecord | LabTestResult

type RecordDetail = {
  id: number
  date: Date
}

export type HealthPrescription = RecordDetail & {
  type: 'health prescription'
  appID?: number // appointment id
  illness: string
  clinicalOpinion: string
}

export type MedicationRecord = RecordDetail & {
  type: 'medication record'
  prescriptionID: number
  medications: {
    medicine: string
    dosage: number
    usage: string
  } []
}

export type LabTestResult = RecordDetail & {
  type: 'lab test result'
  appID: number // appointment id
  title: string
  comment: string
  data: { 
    field: string
    result: string
    normalRange: string
  }[]
}

export const isHealthPrescription = (r: Record): r is HealthPrescription => {
  return r.type === 'health prescription'
}

export const isMedicationRecord = (r: Record): r is MedicationRecord => {
  return r.type === 'medication record'
}

export const isLabTestResult = (r: Record): r is LabTestResult => {
  return r.type === 'lab test result'
}