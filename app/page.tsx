export default function Home() {
  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center">
      <Title/>
    </div>
  );
}

function Title() {
  return (
    <div className="flex flex-col items-center absolute top-1/3 text-center">
      <h1 className="text-5xl md:text-7xl font-bold defaulttext">
        Welcome to Debatify.
      </h1>
      <div className="mt-3 h-1 w-1/4 bg-gray-800 dark:bg-white rounded-full opacity-80" />
    </div>
  );
}