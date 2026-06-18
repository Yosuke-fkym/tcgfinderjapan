const HorizontalAdBanner = ({ position }: { position: string }) => {
  return (
    <div className="h-[500px] w-24 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
      Ad Space ({position})
    </div>
  );
};

export default HorizontalAdBanner;