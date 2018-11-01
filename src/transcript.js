const fillerWords = [
  {
    word: "liksom",
    count: 0
  },
  {
    word: "AS",
    count: 0
  },
  {
    word: "ASA",
    count: 0
  },
  {
    word: "ass",
    count: 0
  },
  {
    word: "assa",
    count: 0
  },
  {
    word: "altså",
    count: 0
  },
  {
    word: "bare",
    count: 0
  },
  // {
  //   word: "på en måte",
  //   count: 0
  // },
  // {
  //   word: "holdt jeg på å si",
  //   count: 0
  // },
  // {
  //   word: "hadde jeg nær sagt",
  //   count: 0
  // },
  // {
  //   word: "når det er sagt",
  //   count: 0
  // },
  // {
  //   word: "egentlig",
  //   count: 0
  // },
  // {
  //   word: "for å si det sånn",
  //   count: 0
  // },
  // {
  //   word: "for å si det på den måten",
  //   count: 0
  // },      
  // {
  //   word: "hvis du kjønner hva jeg mener",
  //   count: 0
  // },
  // {
  //   word: "ikke sant",
  //   count: 0
  // }
];

class Transcript {
  constructor(text) {
    this.text = text || "";
    this.fillerWords = [...fillerWords];
  }
}

export { Transcript as default }