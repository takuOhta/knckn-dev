export interface ApiResults {
  lists: {
    ID: number,
    post_status: string,
    post_title: string,
    post_date: string,
    link: string,
    pickup: string,
  }
}

export async function getPostDataLists(url: string) {
  const response = await fetch(
    url,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const data = (await response.json()) as ApiResults;
  console.log("data", data)
  return data;
}