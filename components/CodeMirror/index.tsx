import { ComponentProps,  useEffect, useMemo, useRef, useState, FC } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState, EditorStateConfig, Extension } from '@codemirror/state'
import { ViewUpdate } from '@codemirror/view'
import { oneDark } from '@codemirror/theme-one-dark'
import { markdown as langMarkdown } from '@codemirror/lang-markdown'

import useFirstRender from '@/common/hooks/useFirstRender'

export type Props = {
  value?: EditorStateConfig['doc']
  selection?: EditorStateConfig['selection']
  onUpdate?: (update: ViewUpdate) => void
  onEditorStateChange?: (editorState: EditorState) => void
  elementProps?: ComponentProps<'div'>
}

const CodeMirror: FC<Props> = ({ value, selection, elementProps, onUpdate, onEditorStateChange }) => {
  const nodeRef = useRef<HTMLDivElement | null>(null)
  const [editorView, setEditorView] = useState<EditorView>()
  const isFirstRender = useFirstRender()

  const updateExtension = useMemo<Extension | undefined>(
    () => (onUpdate ? EditorView.updateListener.of(onUpdate) : undefined),
    []
  )
  const extensions = useMemo<Extension>(
    () => {
      const baseExtensions = [basicSetup, oneDark, langMarkdown()]
      updateExtension && (baseExtensions.unshift(updateExtension))
      return baseExtensions
    },
    [updateExtension]
  )

  // init
  useEffect(() => {
    const state = EditorState.create({
      doc: value,
      selection: selection,
      extensions,
    })

    if (onEditorStateChange) onEditorStateChange(state)
    const view = new EditorView({
      parent: nodeRef.current!,
      state,
    })
    setEditorView(view)
    return () => view.destroy()
  }, [nodeRef])

  // selection
  useEffect(() => {
    if (isFirstRender || !editorView) return
    const transaction = editorView.state.update({
      selection,
    })
    editorView.dispatch(transaction)
  }, [selection, editorView])

  // value
  useEffect(() => {
    if (isFirstRender || !editorView) return
    const transaction = editorView.state.update({
      changes: {
        from: 0,
        to: editorView.state.doc.length,
        insert: value,
      },
      selection: editorView.state.selection,
    })
    editorView.dispatch(transaction)
  }, [value, editorView])

  return <div ref={nodeRef} {...elementProps} />
}

export default CodeMirror