export type reviewType = {
  clientName: string
  empty1: string[]
  empty2: string
}

export const useReview = () => {
  const data: reviewType[] = [
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
