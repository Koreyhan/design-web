import { useState, useEffect } from 'react'
import type { ChangeEvent } from 'react'
import matter from 'gray-matter'
import markdownToHtml from '@/lib/markdownToHtml'
import { ViewUpdate } from '@codemirror/view'

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

  const [mdState, setConfig] = useMdx({
    gfm: false,
    frontmatter: false,
    value: '1212'
  })

  const onMdUpdate = useCallback((vu: ViewUpdate) => {
    if (vu.docChanged) {
      setConfig({ ...mdState, value: String(vu.state.doc) })
    }
  }, [mdState])

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
        <CodeMirror value={mdText} onUpdate={onMdUpdate} />

        <PostBody content={mdContent} />
      </Layout>
    </>
  )
}
