export const amenities = [
  {
    id: "kitchen",
    confirmed: ["furnishedKitchen"],
    pending: ["fridge", "dishwasher", "oven", "hob", "coffee", "cookware"],
  },
  {
    id: "living",
    confirmed: ["dining", "storage"],
    pending: ["sofa", "diningChairs", "lighting"],
  },
  { id: "sleeping", confirmed: ["bed"], pending: ["bedSize", "bedding"] },
  { id: "work", confirmed: ["desk", "internet"], pending: ["deskChair"] },
  {
    id: "bathroom",
    confirmed: ["bathroom"],
    pending: ["bathType", "towels", "laundry"],
  },
];
