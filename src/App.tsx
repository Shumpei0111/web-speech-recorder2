import { Record } from "./components/Record";

const MainSection = () => {
  return (
    <section className="mx-auto w-375 bg-black-5 min-h-screen shadow-lg shadow-black-30 relative z-10 overflow-x-hidden">
      <h1 className="text-40 font-bold border-b border-[#0C244A] flex gap-8 items-center px-16">
        <span className="bg-[#E5671D] block w-16 h-16 rounded-full" />
        <span className="text-[#0C244A]">mic.</span>
      </h1>
      <Record />
    </section>
  );
};

const BackGround = () => {
  return (
    <div className="bg-[#E9E1D9] min-w-full min-h-screen z-[-1] fixed top-0 left-0"></div>
  );
};

function App() {
  return (
    <main>
      <BackGround />
      <MainSection />
    </main>
  );
}

export default App;
