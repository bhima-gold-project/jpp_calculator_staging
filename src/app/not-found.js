export default function NotFound() {
  return (
    <div className="flex flex-col  justify-center items-center">
      <img src='/not-found-1.jpg' className="lg:h-[400px] h-[300px] mix-blend-multiply"/>
      <h1 className="lg:text-2xl">404 - Page Not Found</h1>
      <p className="text-sm lg:text-lg">Sorry, the page you are looking for does not exist.</p>
    </div>
  );
}
