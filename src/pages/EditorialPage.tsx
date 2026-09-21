import { Link } from 'react-router-dom';
import LenisProvider from '../context/LenisProvider';
import EditorialStory from '../components/EditorialStory';
import { ArrowLeft } from 'lucide-react';

export default function EditorialPage() {
  return (
    <LenisProvider>
      <div className="min-h-screen bg-[#0E0805] text-[#FDF8F3]">
        {/* Floating Back to Home button */}
        <div className="fixed top-6 left-6 z-50">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs font-mono tracking-widest uppercase transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* The Why Us Section */}
        <EditorialStory />
      </div>
    </LenisProvider>
  );
}