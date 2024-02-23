/**
 * @see https://github.com/microcmsio/microcms-js-sdk
 */
import { createClient, type MicroCMSQueries } from "microcms-js-sdk";

/**
 * クラインとSDKを初期化
 */
const client = createClient({
  serviceDomain: import.meta.env.PUBLIC_DOMAIN_SERVICE_MICROCMS,
  apiKey: import.meta.env.PUBLIC_API_ENDPOINT_MICROCMS,
});

/**
 * 記事詳細の型定義
 */
export type Blog = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  content: string;
};

/**
 * 記事一覧の取得レスポンスの型定義
 */
export type BlogResponse = {
  totalCount: number;
  offset: number;
  limit: number;
  contents: Blog[];
};

/**
 * APIの呼び出し
 * @param queries
 * @see https://document.microcms.io/content-api/get-list-contents#h9ce528688c
 * @returns <BlogResponse>
 */
export const getMicroCMSBlogs = async (queries?: MicroCMSQueries) => {
  return await client.get<BlogResponse>({ endpoint: "blog", queries });
};

/**
 * 記事詳細の取得
 * @param contentId
 * @param queries
 * @returns <Blog>
 */
export const getMicroCMSBlogsDetail = async (contentId: string, queries?: MicroCMSQueries) => {
  return await client.getListDetail<Blog>({
    endpoint: "blog",
    contentId,
    queries,
  });
};
