import SideBar from "./SideBar";

export default function Layout({ children }) {
  return (
    <div className="container w-full h-screen">
      <div className="h-full flex justify-start items-center a">
        <SideBar />
        <div className="w-3/4">{children}</div>
      </div>
    </div>
  );
}
