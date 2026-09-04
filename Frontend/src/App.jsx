import { BrowserRouter, Route, Routes } from 'react-router-dom'
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

function App() {
  return (
    <div>
      <BrowserRouter>
        <Suspense fallback={null}>
          <Routes>
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
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App
