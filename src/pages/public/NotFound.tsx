import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-8xl font-bold text-[#0B1830] mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-slate-800 mb-4">Page Not Found</h2>
      <p className="text-slate-600 max-w-md mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button className="bg-[#0C6D62] hover:bg-[#0C6D62]/90 text-white rounded-full px-8">
          Return Home
        </Button>
      </Link>
    </div>
  );
}
