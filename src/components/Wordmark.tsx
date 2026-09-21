export default function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex flex-col items-center ${className}`}>
      <span className="font-wordmark text-2xl font-medium uppercase tracking-[0.06em] text-white sm:text-3xl">
        Coffee with Thabi<span className="text-caramel">.</span>
      </span>
      <span className="mt-1 h-[2px] w-2/3 bg-caramel" />
    </span>
  );
}
