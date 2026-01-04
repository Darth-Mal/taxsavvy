import { ArrowRight } from "lucide-react";
import Link from "next/link";

const page = () => {
  return (
    <>
      <section className="flex flex-col justify-center items-center gap-1.5 h-screen">
        <div className="flex justify-center items-center flex-col gap-4">
          <h1 className="max-w-4xl ">
            Your Clear, Simple and Accurate <br /> One‑Stop Platform for <br />{" "}
            Nigeria’s New Tax Reforms.
          </h1>

          <p className="max-w-2xl text-center">
            NaijaTax helps everyday Nigerians understand the new tax reforms,
            calculate what they owe, know their rights and obligations, and stay
            compliant with Nigerian tax laws — without jargon, fear, or
            guesswork.
          </p>
        </div>

        <div className="flex max-w-l gap-5">
          {" "}
          <button className="btn-pry">
            <a href="#calculator" className="centered flex-row">
              Calculate My Taxes
              <ArrowRight />{" "}
            </a>
          </button>
          <button className="btn-sec">Learn How Nigerian Taxes Work</button>
        </div>
      </section>

      <div className="h-200 bg-violet-600 scroll-mt-24" id="calculator"></div>
    </>
  );
};
export default page;
