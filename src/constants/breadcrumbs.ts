import { BreadcrumbsBuilder } from '@utils/BreadcrumbBuilder'

/**
 * トップページのパンくずリスト
 */
class IndexPage extends BreadcrumbsBuilder {
  constructor () {
    super()
    this._push({
      "@type": "ListItem",
      position: 1,
      id: import.meta.env.PUBLIC_SITE_PATH,
      name: import.meta.env.PUBLIC_SITE_NAME,
    })
  }
}

/**
 * アバウトページのパンくずリスト
 */
class AboutPage extends BreadcrumbsBuilder {
  constructor () {
    super()
    this._push({
      "@type": "ListItem",
      position: 2,
      id: import.meta.env.PUBLIC_SITE_PATH + 'about/',
      name: 'アバウトページ',
    })
  }
}

/**
 * 第2階層ページのパンくずリスト
 */
class LowerPage extends BreadcrumbsBuilder {
  constructor () {
    super()
    this._parent(new IndexPage())._push({
      "@type": "ListItem",
      position: 2,
      id: import.meta.env.PUBLIC_SITE_PATH + 'lower/',
      name: '第二階層ページ',
    })
  }
}



export const BREADCRUMBS = {
  INDEX: new IndexPage().getBreadcrumbsJson(),
  ABOUT: new AboutPage().getBreadcrumbsJson(),
  LOWER: new LowerPage().getBreadcrumbsJson(),
} as const satisfies Record<string, string>
