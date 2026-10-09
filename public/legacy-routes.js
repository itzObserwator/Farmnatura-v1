// Preserve old bookmarked chapter URLs before the welcome scene loads.
const legacyRoutes = {
  story: 'about-us',
  farming: 'natural-farming',
  living: 'farmhouses-for-sale-in-hyderabad',
  gallery: 'gallery',
};
const legacyDestination = legacyRoutes[location.hash.slice(1)];
if (legacyDestination) location.replace('/' + legacyDestination);
