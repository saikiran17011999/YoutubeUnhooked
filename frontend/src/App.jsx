/**
 * App Component
 * Main application with routing
 */

import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout';
import {
  HomePage,
  VideoPage,
  CategoryPage,
  FilteredPage,
  SearchPage,
  AddVideoPage,
} from './pages';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Home */}
        <Route index element={<HomePage />} />

        {/* Video detail */}
        <Route path="video/:id" element={<VideoPage />} />

        {/* Category view */}
        <Route path="category/:slug" element={<CategoryPage />} />

        {/* Filtered views */}
        <Route
          path="favorites"
          element={<FilteredPage filterType="favorites" />}
        />
        <Route
          path="watch-again"
          element={<FilteredPage filterType="watch-again" />}
        />
        <Route
          path="watch-later"
          element={<FilteredPage filterType="watch-later" />}
        />

        {/* Search */}
        <Route path="search" element={<SearchPage />} />

        {/* Add video */}
        <Route path="add" element={<AddVideoPage />} />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="text-center py-16">
              <h1 className="text-4xl font-bold mb-4">404</h1>
              <p className="text-yt-text-secondary">Page not found</p>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
