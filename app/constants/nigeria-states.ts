interface Item {
  value: string;
  label: string;
}

interface NigerianState {
  label: string;
  items: Item[];
}

export const nigerianStates: NigerianState[] = [
  {
    label: "North Central",
    items: [
      { value: "benue", label: "Benue" },
      { value: "kogi", label: "Kogi" },
      { value: "kwara", label: "Kwara" },
      { value: "nasarawa", label: "Nasarawa" },
      { value: "niger", label: "Niger" },
      { value: "plateau", label: "Plateau" },
      { value: "abuja", label: "Abuja" },
    ],
  },
  {
    label: "North East",
    items: [
      { value: "adamawa", label: "Adamawa" },
      { value: "bauchi", label: "Bauchi" },
      { value: "borno", label: "Borno" },
      { value: "gombe", label: "Gombe" },
      { value: "taraba", label: "Taraba" },
      { value: "yobe", label: "Yobe" },
    ],
  },
  {
    label: "North West",
    items: [
      { value: "kaduna", label: "Kaduna" },
      { value: "kano", label: "Kano" },
      { value: "katsina", label: "Katsina" },
      { value: "kebbi", label: "Kebbi" },
      { value: "sokoto", label: "Sokoto" },
      { value: "zamfara", label: "Zamfara" },
      { value: "jigawa", label: "Jigawa" },
    ],
  },
  {
    label: "South East",
    items: [
      { value: "abia", label: "Abia" },
      { value: "anambra", label: "Anambra" },
      { value: "ebonyi", label: "Ebonyi" },
      { value: "enugu", label: "Enugu" },
      { value: "imo", label: "Imo" },
    ],
  },
  {
    label: "South South",
    items: [
      { value: "akwa-ibom", label: "Akwa Ibom" },
      { value: "bayelsa", label: "Bayelsa" },
      { value: "cross-river", label: "Cross River" },
      { value: "delta", label: "Delta" },
      { value: "edo", label: "Edo" },
      { value: "rivers", label: "Rivers" },
    ],
  },
  {
    label: "South West",
    items: [
      { value: "ekiti", label: "Ekiti" },
      { value: "lagos", label: "Lagos" },
      { value: "ogun", label: "Ogun" },
      { value: "ondo", label: "Ondo" },
      { value: "osun", label: "Osun" },
      { value: "oyo", label: "Oyo" },
    ],
  },
];
