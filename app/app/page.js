import Link from "next/link";

export default function Home() {
  
  return (
    <div className="p-4">
      Want to score more and learn right.
        <Link href={'/chat'} className="px-4 py-2 rounded-lg bg-white text-slate-800 font-semibold m-2">Start</Link>
    </div>
  );
}