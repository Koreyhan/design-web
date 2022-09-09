import { useEffect, useRef, useState } from 'react'
import * as runtime from 'react/jsx-runtime'
import { VFile } from 'vfile'
import { VFileMessage } from 'vfile-message'
import remarkGfm from 'remark-gfm'
import { evaluate } from '@mdx-js/mdx'

import { useDebounceFn } from 'ahooks'

export type MdxParams = {
  value: string
  gfm?: boolean;
  frontmatter?: boolean;
}

const useMdx = (defaults: MdxParams) => {
  const [state, setState] = useState({...defaults, file: null})
  const { run: setConfig } = useDebounceFn(
    async (config) => {
      const file = new VFile({ basename: 'example.mdx', value: config.value })

      const capture = (name: string) => () => (tree) => {
        file.data[name] = tree
      }

      const remarkPlugins = []
      if (config.gfm) remarkPlugins.push(remarkGfm)
      // if (config.frontmatter) remarkPlugins.push(remarkFrontmatter)
      remarkPlugins.push(capture('mdast'))

      try {
        file.result = (
          await evaluate(file, {
            ...runtime,
            // useDynamicImport: true,
            // remarkPlugins,
            // rehypePlugins: [capture('hast')],
            // recmaPlugins: [capture('esast')]
          })
        ).default
      } catch (error) {
        const message = error instanceof VFileMessage ? error : new VFileMessage(error)
        if (!file.messages.includes(message)) {
          file.messages.push(message)
        }
        message.fatal = true
      }

      setState({ ...config, file })
    },
    { leading: true, trailing: true, wait: 500 }
  )

  return [state, setConfig]
}

export default useMdx
