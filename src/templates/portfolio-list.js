/** @jsx jsx */
import { jsx } from 'theme-ui'
import React from 'react'
import { Link , graphql } from "gatsby"
import { RiArrowRightLine, RiArrowLeftLine } from "react-icons/ri"

import Layout from "../components/layout"
import PostCard from "../components/post-card"
import SEO from "../components/seo"

const styles = {
  pagination: {
    'a': {
      color: 'muted',
      '&.is-active': {
        color: 'text'
      },
      '&:hover': {
        color: 'text'
      }
    }
  }
}

export const portfolioListQuery = graphql`
  query portfolioListQuery($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { frontmatter: { template: { eq: "portfolio-post" } } }
      limit: $limit
      skip: $skip
		) {
      edges {
        node {
          id
          excerpt(pruneLength: 250)
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            slug
						title
						featuredImage {
							childImageSharp {
								fluid(maxWidth: 540, maxHeight: 360, quality: 80) {
                  ...GatsbyImageSharpFluid
                  ...GatsbyImageSharpFluidLimitPresentationSize
                }
							}
						}
          }
        }
      }
    }
  }
`
const Pagination = (props) => (
  <div
    className="pagination"
    sx={styles.pagination}
  >
    <ul>
      {!props.isFirst && (
        <li>
          <Link to={props.prevPage} rel="prev">
          <span className="icon -left"><RiArrowLeftLine/></span> Previous
          </Link>
        </li>
      )}
      {Array.from({ length: props.numPages }, (_, i) => (
        <li key={`pagination-number${i + 1}`} >
          <Link
            to={`${props.portfolioSlug}${i === 0 ? '' : i + 1}`}
            className={props.currentPage === i + 1 ? "is-active num" : "num"}
          >
            {i + 1}
          </Link>
        </li>
      ))}
      {!props.isLast && (
        <li>
          <Link to={props.nextPage} rel="next">
            Next <span className="icon -right"><RiArrowRightLine/></span>
          </Link>
        </li>
      )}
    </ul>
  </div>
)
class PortfolioIndex extends React.Component {
  render() {

    const { data } = this.props
    const { currentPage, numPages } = this.props.pageContext
    const portfolioSlug = '/portfolio/'
    const isFirst = currentPage === 1
    const isLast = currentPage === numPages
    const prevPage = currentPage - 1 === 1 ? portfolioSlug : portfolioSlug + (currentPage - 1).toString()
    const nextPage = portfolioSlug + (currentPage + 1).toString()

    const posts = data.allMarkdownRemark.edges
      .filter(edge => !!edge.node.frontmatter.date)
      .map(edge =>
        <PostCard key={edge.node.id} data={edge.node} />
      )
    let props = {
      isFirst,
      prevPage,
      numPages,
      portfolioSlug,
      currentPage,
      isLast,
      nextPage
    }

    return (
      <Layout className="portfolio-page">
        <SEO
          title={"Portfolio — Page " + currentPage + " of " + numPages}
          description={"Portfolio — Page " + currentPage + " of " + numPages}
        />
        <h1>Portfolio</h1>
        <div className="grids col-1 sm-2 lg-3">
          {posts}
        </div>
        <Pagination {...props} />
      </Layout>
    )
  }
}

export default PortfolioIndex
