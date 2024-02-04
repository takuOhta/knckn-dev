/**
 * ページのID管理
 */
export const PAGE = {
  INDEX: {
    ID: "INDEX",
    CLASSNAME: "index",
  },
  ABOUT: {
    ID: "ABOUT",
    CLASSNAME: "about",
  },
  BLOG: {
    ID: "BLOG",
    CLASSNAME: "blog",
  },
  BLOG_DETAIL: {
    ID: "BLOG_DETAIL",
    CLASSNAME: "blog-detail",
  },
} as const satisfies Record<string, { ID: string; CLASSNAME: string }>;
