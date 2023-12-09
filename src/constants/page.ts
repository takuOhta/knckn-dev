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
  NEWS: {
    ID: "NEWS",
    CLASSNAME: "news",
  },
  NOTFOUND: {
    ID: "NOTFOUND",
    CLASSNAME: "notfound",
  },
  LOWER: {
    ID: "LOWER",
    CLASSNAME: "lower",
  },
} as const satisfies Record<string, {ID: string, CLASSNAME: string}>
