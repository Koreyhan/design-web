type Props = {
  content: string
}

const PostBody = ({ content }: Props) => {
  return (
    <div className="">
      <div
        className="common-markdown"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  )
}

export default PostBody
