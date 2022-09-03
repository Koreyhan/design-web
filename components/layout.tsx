import Footer from './Footer'
import Meta from './Meta'

type Props = {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <Meta />
      <main className="common-container">
        {children}
      </main>
      <Footer />
    </>
  )
}

export default Layout
