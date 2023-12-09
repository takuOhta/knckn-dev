import type { Meta, StoryObj } from '@storybook/vue3'
import IndexSectionKv from './IndexSectionKv.vue'

type Story = StoryObj<typeof IndexSectionKv>

// メタ情報 & 共通設定
const meta: Meta<typeof IndexSectionKv> = {
  title: 'CTV Service Site/Pages/index/IndexSectionKv',
  component: IndexSectionKv,
  render: args => ({
    components: { IndexSectionKv },
    setup: () => ({ args }),
    template: '<IndexSectionKv v-bind="args" />',
  }),
  tags: ['autodocs'],
  args: {
  },
  argTypes: {
  },
}

export const Default: Story = {
}

export default meta
