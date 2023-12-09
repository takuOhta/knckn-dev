import type { Meta, StoryObj } from '@storybook/vue3'
import ButtonBox from './ButtonBox.vue'

type Story = StoryObj<typeof ButtonBox>

// メタ情報 & 共通設定
const meta: Meta<typeof ButtonBox> = {
  title: 'CTV Service Site/Parts/Buttons/ButtonBox',
  component: ButtonBox,
  render: args => ({
    components: { ButtonBox },
    setup: () => ({ args }),
    template: '<ButtonBox v-bind="args" />',
  }),
  tags: ['autodocs'],
  args: {
    label: 'ボタン',
  },
  argTypes: {
    label: {
      control: {
        type: 'text',
      },
    },
  },
}

export const Default: Story = {
  
}

export default meta
