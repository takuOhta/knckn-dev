import type { BreadcrumbsItem } from '@tsTypes/schema'

/**
 * パンくずリストのビルダー
 */
export abstract class BreadcrumbsBuilder {
  #breadcrumbsItems: BreadcrumbsItem[] = [] // パンくずリストの項目
  #parentBuilder: BreadcrumbsBuilder | null = null // 親階層のパンくずリストのビルダー

  /**
   * 親階層のパンくずリストのビルダーをセットする
   * @param builder 
   * @returns 親階層のパンくずリストのビルダー
   */
  protected _parent (builder: BreadcrumbsBuilder) {
    this.#parentBuilder = builder
    return this
  }

  /**
   * 自身にパンくずリストの項目を追加する
   * @param item 
   */
  protected _push (item: BreadcrumbsItem) {
    this.#breadcrumbsItems.push(item)
  }

  /**
   * パンくずリストの項目を返す
   * @returns 親階層のパンくずと自身のパンくずを結合したパンくずリストの項目
   */
  #getBreadcrumbs (): BreadcrumbsItem[] {
    if (!this.#parentBuilder) {
      return this.#breadcrumbsItems
    }
    return this.#parentBuilder.#getBreadcrumbs().concat(this.#breadcrumbsItems)
  }

  /**
   * Json形式のパンくずリストを返す
   * @returns Json形式のパンくずリスト
   */
  getBreadcrumbsJson (): string {
    return JSON.stringify(this.#getBreadcrumbs())
  }
}