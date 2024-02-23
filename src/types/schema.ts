import { BREADCRUMBS } from "@constants/breadcrumbs"
/**
 * Schema.org types
 * @see https://schema.org/BreadcrumbList
 */
export type BreadcrumbsItem = {
  "@type": string
  position: number
  id: string
  name: string
}
/**
 * Breadcrumbsのキー
 */
export type BREADCRUMBS_KEYS = keyof typeof BREADCRUMBS
/**
 * Breadcrumbsの値
 */
export type BREADCRUMBS_VALUES = typeof BREADCRUMBS[BREADCRUMBS_KEYS]