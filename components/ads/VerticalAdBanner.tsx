const VerticalAdBanner = ({ position }: { position: string }) => {
  return (
    <div className="w-full h-24 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
      Ad Space ({position})
    </div>
  );
};

export default VerticalAdBanner;