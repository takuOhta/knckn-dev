const COMPONENT_GENERATOR_NAME = 'component'
const COMPONENT_PATH = 'src/components/'

export default (
  /** @type {import('plop').NodePlopAPI} */
  plop
) => {
  const componentGeneratorConfig = {
    description: 'Create a new component',
    prompts: [
      {
        type: 'input',
        name: 'category',
        message:
          'What is the category of the component? (e.g. Parts/Buttons, Pages/index, Layouts)',
      },
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the component?',
      },
    ],
    actions: [
      {
        type: 'add',
        path: `${COMPONENT_PATH}{{category}}/{{pascalCase name}}.vue`,
        templateFile: 'plop-templates/component/Component.vue.hbs',
      },
      {
        type: 'add',
        path: `${COMPONENT_PATH}{{category}}/{{pascalCase name}}.stories.ts`,
        templateFile: 'plop-templates/component/Component.stories.ts.hbs',
      },
    ],
  }
  plop.setGenerator(COMPONENT_GENERATOR_NAME, componentGeneratorConfig)
}
