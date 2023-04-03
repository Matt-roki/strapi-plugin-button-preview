import { prefixPluginTranslations } from '@strapi/helper-plugin'
import pluginId from './pluginId'
import ButtonIcon from './components/ButtonIcon'
import getTrad from './utils/getTrad'

export default {
  register(app) {
    app.customFields.register({
      name: 'button-preview',
      pluginId: 'button-preview',
      type: 'json',
      icon: ButtonIcon,
      intlLabel: {
        id: getTrad('button-preview.label'),
        defaultMessage: 'Button preview',
      },
      intlDescription: {
        id: getTrad('button-preview.description'),
        defaultMessage: 'View the style of a button before publishing',
      },
      components: {
        Input: async () => import('./components/Button'),
      },
      options: {
        base: [
          {
            sectionTitle: null,
            items: [
              {
                name: 'options.type',
                type: 'textarea-enum',
                intlLabel: {
                  id: getTrad('button-preview.enum.label'),
                  defaultMessage: 'Options (one per line)',
                },
                description: {
                  id: getTrad('button-preview.enum.description'),
                  defaultMessage:
                    'Enter one option per line. This option will be matched with the css provided',
                },
                placeholder: {
                  id: getTrad('button-preview.enum.placeholder'),
                  defaultMessage: 'primary\nsecondary\n...',
                },
              },
              {
                name: 'options.css',//name of an related field
                type: 'textarea',//input type
                intlLabel: {
                  id: getTrad('url.text'),
                  defaultMessage: 'CSS',//label for the info field
                },
                description: {
                  id: getTrad('url.description'),
                  defaultMessage:
                    'Please match the class name with one of the options for this to work',//description for field
                },
                placeholder: {
                  id: getTrad('url.placeholder'),
                  defaultMessage: '.primary{\nbackgroundColor: "red"\n},\n.secondary{\nbackgroundColor: "blue"\n}',
                },
              },
            ],
          },
        ],
        advanced: [
          {
            sectionTitle: {
              id: 'global.settings',
              defaultMessage: 'Settings',
            },
            items: [
              {
                name: 'required',
                type: 'checkbox',
                intlLabel: {
                  id: 'form.attribute.item.requiredField',
                  defaultMessage: 'Required field',
                },
                description: {
                  id: 'form.attribute.item.requiredField.description',
                  defaultMessage:
                    "You won't be able to create an entry if this field is empty",
                },
              },
              {
                name: 'options.global',//name of an related field
                type: 'textarea',//input type
                intlLabel: {
                  id: getTrad('advanced.text'),
                  defaultMessage: 'Global CSS',//label for the info field
                },
                placeholder: {
                  id: getTrad('advanced.description'),
                  defaultMessage:
                    'display: "flex";\nflexDirection: "row";\ngap: "10px";\nalignItems:"center";',//description for field
                },
                description: {
                  id: getTrad('url.placeholder'),
                  defaultMessage: 'This is the global CSS that will be applied to every button',
                },
              },
            ],
          },
        ],
      },
    })
  },

  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return Promise.all([import(`./translations/${locale}.json`)])
          .then(([pluginTranslations]) => {
            return {
              data: {
                ...prefixPluginTranslations(
                  pluginTranslations.default,
                  pluginId,
                ),
              },
              locale,
            }
          })
          .catch(() => {
            return {
              data: {},
              locale,
            }
          })
      }),
    )
    return Promise.resolve(importedTrads)
  },
}
