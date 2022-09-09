import { useState, useEffect } from 'react'
import type { ChangeEvent } from 'react'
import matter from 'gray-matter'
import markdownToHtml from '@/lib/markdownToHtml'
import { ViewUpdate } from '@codemirror/view'

import { TextArea } from '@douyinfe/semi-ui'
import Layout from '@/components/Layout'
import PostBody from '@/components/PostBody'
import CodeMirror from '@/components/CodeMirror'

import useMdx from '@/common/hooks/useMdx'

import Style from './index.module.scss'
import { useCallback } from 'react'

type Props = {
}

interface BaseInfo {
  title?: string;
}

export default function Index({ }: Props) {
  const [baseInfo, setBaseInfo] = useState<BaseInfo>()
  const [mdText, setMdText] = useState('')
  const [mdContent, setMdContent] = useState('')

  const [state, setConfig] = useMdx({
    gfm: false,
    frontmatter: false,
    value: '1212'
  })

  const onCodeUpdate = useCallback((update: ViewUpdate) => {
    setConfig({ ...state, value: String(update.state.doc) })
  }, [])

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const { data, content } = matter(reader.result as string)
        setBaseInfo(data as BaseInfo)
        setMdText(content)
      }
      reader.readAsText(file)
    }
  }

  useEffect(() => {
    const a = async () => {
      const content = await markdownToHtml(mdText)
      setMdContent(content)
    }
    a()
  }, [mdText])

  return (
    <>
      <Layout>
        <input type="file" accept=".md" onInput={handleFileChange} />
        <CodeMirror value="$ doc" onUpdate={onCodeUpdate} />

        <PostBody content={mdContent} />
      </Layout>
    </>
  )
}
