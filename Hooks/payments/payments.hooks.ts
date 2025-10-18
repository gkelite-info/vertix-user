export type rePaymentType = {
  name: string
  email: string
  mobile: string
  country: string
}

export const usePayment = () => {
  const data: rePaymentType[] = [
    {
      name: "Priya Mehta",
      email: "user@gmail.com",
      mobile: "+1 202-555-0147",
      country: "USA",
    },
    {
      name: "Carlos Ruiz",
      email: "user@gmail.com",
      mobile: "+1 202-555-0147",
      country: "India",
    },
    {
      name: "Anna Becker",
      email: "user@gmail.com",
      mobile: "+1 202-555-0147",
      country: "USA",
    },
    {
      name: "Priya Mehta",
      email: "user@gmail.com",
      mobile: "+1 202-555-0147",
      country: "India",
    },
    {
      name: "Carlos Ruiz",
      email: "user@gmail.com",
      mobile: "+1 202-555-0147",
      country: "USA",
    },
    {
      name: "Anna Becker",
      email: "user@gmail.com",
      mobile: "+1 202-555-0147",
      country: "India",
    },
  ]

  return { data }
}
