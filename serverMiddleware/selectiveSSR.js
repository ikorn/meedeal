export default function(req, res, next) {
  const paths = ['user/signin', '/deals/new', '/deals/confirm']
  // A very simple check
  if (paths.includes(req.originalUrl)) {
    // Will trigger the "traditional SPA mode"
    res.spa = true
  }
  // Don't forget to call next in all cases!
  // Otherwise, your app will be stuck forever :|
  next()
}
