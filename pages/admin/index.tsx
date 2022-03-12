import Link from "next/link";

export default function Admin() {
  return (
    <div className="">
      <div>관리자 페이지 입니다.</div>
      <Link href="/admin/user">
        <a>유저 관리</a>
      </Link>
    </div>
  );
}
