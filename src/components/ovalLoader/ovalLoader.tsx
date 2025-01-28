const OvalLoader = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-20 h-20">
        <div className="absolute w-full h-full border-4 border-blue-200 rounded-full"></div>
        <div className="absolute w-full h-full border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default OvalLoader;
