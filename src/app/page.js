'use client'

import Image from 'next/image';
import bhima_boy from '../../public/bhima_boy.png';

export default function Home() {

  return (
    <div className="flex-1 flex items-center justify-center px-4">

      <div className="max-w-6xl mx-auto w-full">

        <div className="flex flex-col items-center justify-center text-center">
          <Image
            src={bhima_boy}
            alt="Bhima Logo"
            width={180}
            height={180}
            className="object-contain mb-4 md:mb-6"
            priority
          />
          <p className="font-quiche text-[48px] md:text-[60px] leading-none text-[#be8c2f]">
            JPP Calculator
          </p>

          <p className="font-work mt-5 text-[#5c5c5c] text-[17px] md:text-[24px] leading-8 md:leading-10 max-w-4xl">

            Calculate JPP scheme benefits instantly including
            maturity value, monthly contribution, bonus eligibility,
            and estimated returns with an easy-to-use calculator.

          </p>

        </div>

      </div>

    </div>
  );
}
