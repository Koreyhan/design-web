import Container from '../components/Container'
import HeroPost from '../components/HeroPost'
import Layout from '../components/Layout'
import { getAllPosts } from '../lib/api'
import Head from 'next/head'
import Post from '../types/post'

type Props = {
  allPosts: Post[]
}

export default function Index({ allPosts }: Props) {
  return (
    <>
      <Layout>
        <Head>
          <title>Blog Example</title>
        </Head>
        <Container>
          {allPosts.map(item => (
            <HeroPost
              key={item.title}
              title={item.title}
              coverImage={item.coverImage}
              date={item.date}
              author={item.author}
              slug={item.slug}
              excerpt={item.excerpt}
            />
          ))}
        </Container>
      </Layout>
    </>
  )
}

export const getStaticProps = async () => {
  const allPosts = getAllPosts([
    'title',
    'date',
    'slug',
    'author',
    'coverImage',
    'excerpt',
  ])

  return {
    props: { allPosts },
  }
}
