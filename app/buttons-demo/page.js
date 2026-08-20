import GenerateButton from "../../components/GenerateButton";
// this page is just a demo of the GenerateButton component, which is used in the capstone project. It is not part of the capstone itself.

export default function ButtonsDemoPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-8 p-8">
      <div className="text-center max-w-md">
        <h1 className="text-zinc-100 text-xl font-semibold mb-2">
          Buttons with a Brain
        </h1>
        <p className="text-zinc-500 text-sm">
          A button that communicates its own state through motion —
          reused from the "Analyze Profile" button in the capstone.
        </p>
      </div>
      <GenerateButton />
    </div>
  );
}