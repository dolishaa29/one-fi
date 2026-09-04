import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import SellerPrivateRoute from './components/SellerPrivateRoute'

const Home = lazy(() => import('./pages/Home'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const About = lazy(() => import('./pages/About'));
const SellerRegister = lazy(() => import('./pages/SellerRegister'));
const SellerLogin = lazy(() => import('./pages/SellerLogin'));
const SellerDashboard = lazy(() => import('./pages/SellerDashboard'));
const SellerProductForm = lazy(() => import('./pages/SellerProductForm'));
const SellerProfile = lazy(() => import('./pages/SellerProfile'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Keying on pathname remounts the routed page on every navigation, which
// replays the .page-transition fade/rise defined in index.css - a single
// place to animate page changes instead of touching every page component.
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-transition">
      <Routes location={location}>
        <Route path='/' element={<Home />} />
        <Route path='/products/:slug' element={<ProductPage />} />
        <Route path='/how-it-works' element={<HowItWorks />} />
        <Route path='/about' element={<About />} />

        <Route path='/seller/register' element={<SellerRegister />} />
        <Route path='/seller/login' element={<SellerLogin />} />
        <Route path='/seller/dashboard' element={<SellerPrivateRoute><SellerDashboard /></SellerPrivateRoute>} />
        <Route path='/seller/profile' element={<SellerPrivateRoute><SellerProfile /></SellerPrivateRoute>} />
        <Route path='/seller/products/new' element={<SellerPrivateRoute><SellerProductForm /></SellerPrivateRoute>} />
        <Route path='/seller/products/:id/edit' element={<SellerPrivateRoute><SellerProductForm /></SellerPrivateRoute>} />

        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <div>
      <BrowserRouter>
        <Suspense fallback={null}>
          <AnimatedRoutes />
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App
