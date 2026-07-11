import Link from 'next/link';

export default function AppCTA() {
  return (
    <div className="mt-12 rounded-2xl bg-[#0F7B6C] p-8 text-center text-white">
      <h3 className="text-2xl font-bold mb-2">Be the First to Report</h3>
      <p className="text-white/80 mb-6 max-w-xl mx-auto">
        Join thousands of citizen journalists across Africa. Report incidents, go live, and keep your community informed — instantly from your phone.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/register" className="px-6 py-3 bg-white text-[#0F7B6C] font-semibold rounded-xl hover:bg-gray-100 transition">
          Sign Up Free
        </Link>
        <Link href="/feed" className="px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition">
          Browse Reports
        </Link>
      </div>
    </div>
  );
}
