import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="font-display text-7xl font-extrabold text-orange-500">404</span>
      <h1 className="mt-4 font-display text-2xl font-bold text-navy-800">
        Không tìm thấy trang · Page not found
      </h1>
      <p className="mt-3 max-w-md text-navy-500">
        Trang bạn tìm không tồn tại hoặc đã được di chuyển.
        <br />
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/vi" className="btn-primary mt-8">
        Về trang chủ · Back home
      </Link>
    </div>
  );
}
