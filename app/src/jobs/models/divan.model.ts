import * as mongoose from 'mongoose';

export enum Diseases {
  Albuminuria = "Albuminuria",
  Alcoholism = "Alcoholism",
  AlzheimerDisease = "AlzheimerDisease",
  AmyotrophicLateralSclerosis = "AmyotrophicLateralSclerosis",
  Arthritis_Rheumatoid = "Arthritis_Rheumatoid",
  Asthma = "Asthma",
  AttentionDeficitDisorderwithHyperactivity = "AttentionDeficitDisorderwithHyperactivity",
  BehcetSyndrome = "BehcetSyndrome",
  BipolarDisorder = "BipolarDisorder",
  BodyWeightChanges = "BodyWeightChanges",
  BodyWeight = "BodyWeight",
  BreastNeoplasms = "BreastNeoplasms",
  CardiovascularDiseases = "CardiovascularDiseases",
  CarotidArteryDiseases = "CarotidArteryDiseases",
  Colitis_Ulcerative = "Colitis_Ulcerative",
  CoronaryArteryDisease = "CoronaryArteryDisease",
  CoronaryDisease = "CoronaryDisease",
  CrohnDisease = "CrohnDisease",
  Death_Sudden_Cardiac = "Death_Sudden_Cardiac",
  DepressiveDisorder_Major = "DepressiveDisorder_Major",
  DiabetesMellitus_Type1 = "DiabetesMellitus_Type1",
  DiabetesMellitus_Type2 = "DiabetesMellitus_Type2",
  DiabeticNephropathies = "DiabeticNephropathies",
  HeartFailure = "HeartFailure",
  Hypertension = "Hypertension",
  Hypertrophy_LeftVentricular = "Hypertrophy_LeftVentricular",
  Inflammation = "Inflammation",
  InflammatoryBowelDiseases = "InflammatoryBowelDiseases",
  InsulinResistance = "InsulinResistance",
  LupusErythematosus_Systemic = "LupusErythematosus_Systemic",
  MacularDegeneration = "MacularDegeneration",
  MentalCompetency = "MentalCompetency",
  MetabolicSyndromeX = "MetabolicSyndromeX",
  MultipleSclerosis = "MultipleSclerosis",
  MyocardialInfarction = "MyocardialInfarction",
  Neuroblastoma = "Neuroblastoma",
  Obesity = "Obesity",
  Osteoporosis = "Osteoporosis",
  PancreaticNeoplasms = "PancreaticNeoplasms",
  ParkinsonDisease = "ParkinsonDisease",
  ProstaticNeoplasms = "ProstaticNeoplasms",
  Psoriasis = "Psoriasis",
  Schizophrenia = "Schizophrenia",
  Sleep = "Sleep",
}

export enum VariantType {
  KNOWN = 'known',
  UNKNOWN = 'unknown',
}

export enum InputType {
  VARIANTBASED = 'variant_based',
  REGIONBASED = 'region_based',
}

export enum VariantDB {
  KGP = '1KG',
  COSMIC = 'cosmic',
  ENSEMBL = "Ensembl"
}

//Interface that describe the properties that are required to create a new job
interface DivanAttrs {
  job: string;
  useTest: string;
  marker_name?: string;
  chr?: string;
  start_position?: string;
  stop_position?: string
  variant_type: VariantType;
  disease: Diseases;
  variant_db?: VariantDB;
  input_type: InputType;
}

// An interface that describes the extra properties that a eqtl model has
//collection level methods
interface DivanModel extends mongoose.Model<DivanDoc> {
  build(attrs: DivanAttrs): DivanDoc;
}

//An interface that describes a properties that a document has
export interface DivanDoc extends mongoose.Document {
  id: string;
  version: number;
  useTest: boolean;
  marker_name?: number;
  chr?: number;
  start_position?: number;
  stop_position?: number
  variant_type: VariantType;
  disease: Diseases;
  variant_db?: VariantDB;
  input_type: InputType;
}

const DivanSchema = new mongoose.Schema<DivanDoc, DivanModel>(
  {
    useTest: {
      type: Boolean,
      trim: true,
    },
    marker_name: {
      type: Number,
      trim: true,
    },
    chr: {
      type: Number,
      trim: true,
    },
    start_position: {
      type: Number,
      trim: true,
    },
    stop_position: {
      type: Number,
      trim: true,
    },
    variant_type: {
      type: String,
      enum: [VariantType.KNOWN, VariantType.UNKNOWN],
      trim: true,
      default: VariantType.KNOWN,
    },
    disease: {
      type: String,
      enum: [...Object.values(Diseases)],
      trim: true,
    },
    variant_db: {
      type: String,
      enum: [VariantDB.KGP, VariantDB.COSMIC, VariantDB.ENSEMBL],
      trim: true,
      default: VariantDB.KGP,
    },
    input_type: {
      type: String,
      enum: [InputType.VARIANTBASED, InputType.REGIONBASED],
      trim: true,
      default: InputType.VARIANTBASED,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DivanJob',
      required: true,
    },
    version: {
      type: Number,
    },
  },
  {
    timestamps: true,
    versionKey: 'version',
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        // delete ret._id;
        // delete ret.__v;
      },
    },
  },
);

//increments version when document updates
DivanSchema.set('versionKey', 'version');

//collection level methods
DivanSchema.statics.build = (attrs: DivanAttrs) => {
  return new DivanModel(attrs);
};

//create mongoose model
const DivanModel = mongoose.model<DivanDoc, DivanModel>(
  'Divan',
  DivanSchema,
  'divan',
);

export { DivanModel };
