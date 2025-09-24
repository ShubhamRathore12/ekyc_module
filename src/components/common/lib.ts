export interface OptionsType {
  value: string;
  label: string;
}

export interface BlobFile {
  base64?: string | ArrayBuffer;
  type?: string;
  lastModified?: number;
  name?: string;
  size?: number;
}

export const moreOptions: OptionsType[] = [
  {
    value: "freeze column",
    label: "Freeze Column",
  },
];

export const somethingArray = [
  {
    value: "something1",
    label: "SomeThing1",
  },
  {
    value: "something2",
    label: "SomeThing2",
  },
  {
    value: "something3",
    label: "SomeThing3",
  },
  {
    value: "something4",
    label: "SomeThing4",
  },
  {
    value: "something5",
    label: "SomeThing5",
  },
  {
    value: "something6",
    label: "SomeThing6",
  },
];

export const YesOrNo = [
  { type: "yes", title: "YES" },
  { type: "no", title: "NO" },
];

export const education = [
  {
    value: "ssc",
    label: "SSC",
  },
  {
    value: "intermediate",
    label: "INTERMEDIATE",
  },
  {
    value: "degree",
    label: "DEGREE",
  },

  {
    value: "btech",
    label: "B.Tech",
  },
  {
    value: "post graduate",
    label: "Post Graduate",
  },
];

export const occupation = [
  {
    value: "bussiness",
    label: "Bussiness",
  },
  {
    value: "farming",
    label: "Farming",
  },
  {
    value: "etc",
    label: "ETC",
  },
];
export const options = [
  {
    value: "personalised cheque",
    lable: "PERSONALISED CHEQUE",
  },
  {
    value: "bank statement",
    lable: "BANK STATEMENT",
  },
  {
    value: "bank passbook",
    lable: "BANK PASSBOOK",
  },
  {
    value: "bank letter",
    lable: "BANK LETTER",
  },
];
