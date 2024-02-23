
/**
 * GlobalEventで呼び出されるコールバック関数
 */
export type postNewsList = {
  lists: Array<{
    ID: number,
    post_status: string,
    post_title: string,
    post_date: string,
    link: string,
    pickup: string,
  }>
}

export type postNewsDetail = {
  ID: number,
  post_status: string,
  post_title: string,
  post_date: string,
  link: string,
  pickup: string,
}

