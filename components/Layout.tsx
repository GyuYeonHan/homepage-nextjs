import SideBar from "./SideBar";

export default function Layout({ children }) {
  return (
    <div className="container w-full h-screen">
      <div className="h-full flex justify-start items-center">
        <SideBar />
        <div className="w-3/4 m-6">{children}</div>
      </div>
    </div>
  );
}