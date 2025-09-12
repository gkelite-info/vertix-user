export type manageTaxType = {
  clientName: string
  empty1: string[]
  empty2: string
}

export const useManageTax = () => {
  const data: manageTaxType[] = [
    {
      clientName: "Priya Mehta",
      empty1: ["Anna Becker", "priya mehta"],
      empty2: "Lorem Ipsum",
    },
    {
      clientName: "Priya Mehta",
      empty1: ["Anna Becker", "priya mehta"],
      empty2: "Lorem Ipsum",
    },
    {
      clientName: "Priya Mehta",
      empty1: ["Anna Becker", "priya mehta"],
      empty2: "Lorem Ipsum",
    },
    {
      clientName: "Priya Mehta",
      empty1: ["Anna Becker", "priya mehta"],
      empty2: "Lorem Ipsum",
    },
  ]

  return {
    data,
  }
}
