module.exports = {
  siteMetadata: { title: 'Safis CMS App' },
  plugins: [
    'gatsby-plugin-sass',
    {
      resolve: 'gatsby-plugin-manifest',
      options: { icon: 'src/images/icon.png' },
    },
  ],
}
