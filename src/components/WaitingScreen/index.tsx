interface WaitingScreenProps {
  title: string;
}

export default function WaitingScreen({ title }: WaitingScreenProps) {
  return (
    <div className="w-screen h-screen absolute top-0 left-0 bg-black/50 flex items-center justify-center">
      <p className="text-white text-2xl font-bold">{title}</p>
    </div>
  );
}
