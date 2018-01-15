
const categories = {

  'allergy': {
    name: 'Allergy',
    description: `The symptoms of pollen allergy resemble them when they are cold. You get runny nose and nasal congestion and it is common for it to sneak in your nose and eyes. You often sneeze in a series and itchy eyes and nose is common. Red and runny eyes are also common symptoms. The most important thing you can do to reduce the problem is to avoid pollen. Follow pollen forecasts, do not weigh when it's the highest pollen (early morning), shower and wash your hair before you go to bed, do not pollinate pollinating plants that bother you and take off your outerwear when you're out.`
  },
  'eye-complaint': {
    name: 'Eye complaint',
    parent: 'allergy',
    description: `There are many good tips on what you can do to reduce your inconvenience in addition to non-prescription drugs. Consult our customer service or with the healthcare advice where you live. You should also turn around if your inconvenience is happening year-round, or if you are unable to get out of your mind by self-care. The goal should always be that you are symptom free even if you have pollen allergy.\n\nIn the case of allergy, there is seldom trouble in the eyes only, but it is usually a combination of problems in the eyes and nose. Antihistamine tablets are the first recommendation for allergic problems with pollen, but if you do not want to take antihistamine tablets or if you're not ready for trouble-free treatment, you can complement an antihistaminespray, cortisone spray and eye drops with antihistamine or chromoglycate instead.`
  },
  'nasal-obstruction': {
    name: 'Nasal obstruction',
    parent: 'allergy',
    description: `Nausea problems can be prevented with a chromosome spray. If you already have a runny nose, an antihistamine spray is a good choice. If you do not get enough effect of chromoglycate and antihistamine spray or if you are most clogged, try a cortisone spray. Cortisone spray is best suited for maintenance treatment when maximum power comes first after a few days. You will find these nasal sprays in this category along with a number of nasal sprayers with protective properties and saline nasal spray to rinse the nose. Rinsing the nose free of pollen can be an effective way to reduce your allergic problems.`
  }
};

const products = {
  'drop-it-disposable-pipettes-2-ml-20-pcs': {
    category: 'eye-complaint',
    name: 'Drop-it disposable pipettes 2 ml, 20 pcs',
    amount: 35,
    currency: 'SEK',
    description: `Drop-it endipipettes can be used by both adults and children to rinse lenses and moisturize dry eyes. Drop-it is a sterile, buffered physiological saline solution without preservatives with the same salinity naturally present in the tear fluid. That drop-it does not contain regular preservatives makes it useful to use with contact lenses.\n\nIf you are taking ophthalmic medicines, wait 15 minutes before saline drops in your eye. If you have long-term problems with dryness and irritation, consult your optician or ophthalmologist for consultation. Drop-it is a CE-labeled medical device class IIb.`
  },
  'livostin-eye-drops-suspension-0-5-mg-ml-4-ml': {
    category: 'eye-complaint',
    name: 'Livostin eye drops, suspension 0.5 mg / ml 4 ml',
    amount: 89,
    currency: 'SEK',
    description: `Livostin eye drops are used in allergic conditions such as red, swollen, flowing and itchy eyes.\n\nLivostin eye drops are prescription free in short-term treatment of pollen allergy. Livostin counteracts an allergic reaction by blocking the effect of histamine. It is the histamine that causes red, swollen and itchy eyes that are torn. The effect of Livostin occurs after about 15 minutes. Livostin eye drops contain the preservative benzalkonium chloride which may cause eye irritation and discoloration of soft contact lenses. Therefore, soft contact lenses should not be used with Livostin eye drops. If you need to use soft contact lenses, these should be taken before use and then wait at least 15 minutes after administration before reinserting.\n\nFor adults and children. Children should be diagnosed by a doctor.`
  },

  'renaissance-natural-nasal-spray-30-ml': {
    category: 'nasal-obstruction',
    name: 'Renaissance natural nasal spray 30 ml',
    amount: 39,
    currency: 'SEK',
    description: `The Renaissance Natural is a salt solution in the form of a nasal spray that cleans and moisturizes the nose. The Renaissance Natural is free from preservatives and swelling agents. The spray cleans and restores moisture balance in the nose without irritating the esophagus.\n\nThe Renaissance Natural is used for prevention, in dry nasal membranes, in cold and allergies.\n\nCan be used by infants, children and adults.\n\nCE-marked medical device class I.`
  }
};

export default {
  categories,
  products
};